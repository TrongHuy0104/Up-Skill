import { useGetCategoriesQuery, Category } from '@/lib/redux/features/category/categoryApi';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

export default function CategoryComponent() {
    const { data: categories = [] } = useGetCategoriesQuery();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [subMenuStyle, setSubMenuStyle] = useState<{ top: number }>({ top: 0 });
    const categoryListRef = useRef<HTMLUListElement>(null);
    const categoryRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

    useEffect(() => {
        if (hoveredCategory && categoryRefs.current[hoveredCategory] && categoryListRef.current) {
            const categoryRect = categoryRefs.current[hoveredCategory]!.getBoundingClientRect();
            const listRect = categoryListRef.current.getBoundingClientRect();

            const subCategories = categories.find((cat) => cat._id === hoveredCategory)?.subCategories || [];
            const subMenuHeight = subCategories.length * 54;

            let topPosition = categoryRect.top - listRect.top;

            const bottomSpace = window.innerHeight - categoryRect.top;
            if (subMenuHeight > bottomSpace) {
                const adjustment = Math.min(subMenuHeight - bottomSpace + 30, topPosition);
                topPosition -= adjustment;
            }

            topPosition = Math.max(0, topPosition);

            setSubMenuStyle({ top: topPosition });
        }
    }, [hoveredCategory, categories]);

    return (
        <div className="group relative flex items-center justify-center gap-[10px] px-5 py-[10px] hover:bg-accent-100 cursor-pointer rounded">
            <span className="font-medium text-[14px]">Categories</span>
            <Image src={arrowDownIcon} alt="Arrow Down Icon" />
            <div className="absolute top-0 left-0 right-0 h-[66px]" />
            <ul
                ref={categoryListRef}
                className="absolute left-0 top-full min-w-[330px] rounded bg-primary-50 border border-primary-100 opacity-0 invisible pointer-events-none translate-y-[18px] 
                transition ease-linear delay-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-[10px] group-hover:pointer-events-auto"
            >
                <li className="h-[60px] leading-[60px] line pt-2 text-[14px] text-primary-800 font-medium px-4 cursor-default">
                    COURSE CATEGORIES
                </li>
                {categories.map((category: Category) => (
                    <li
                        key={category._id}
                        ref={(el) => {
                            categoryRefs.current[category._id] = el;
                        }}
                        onMouseEnter={() => setHoveredCategory(category._id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="relative group/item flex justify-between items-center px-2 cursor-pointer text-base font-medium hover:bg-accent-100 
                      hover:text-accent-900 transition ease-linear"
                    >
                        <span
                            className="absolute left-[-1px] bottom-0 top-auto w-[2px] bg-accent-900 transition-all h-0 ease-linear
              group-hover/item:h-full group-hover/item:top-0 group-hover/item:bottom-0"
                        />

                        <Link
                            href={`/courses?category=${category.title}`}
                            className="w-full h-full flex items-center px-3 py-[15px]"
                        >
                            {category.title}
                        </Link>

                        {category.subCategories && category.subCategories.length > 0 && (
                            <span className="ml-2">&#9656;</span>
                        )}

                        {hoveredCategory === category._id &&
                            category.subCategories &&
                            category.subCategories.length > 0 && (
                                <ul
                                    className="fixed left-[100%] w-[330px] bg-accent-100 shadow-lg rounded-md border border-primary-100 flex flex-col"
                                    style={{
                                        top: `${subMenuStyle.top}px`,
                                        maxHeight: 'calc(100vh - 100px)',
                                        overflow: 'auto'
                                    }}
                                >
                                    {category.subCategories.map((sub) => (
                                        <li
                                            key={sub._id}
                                            className="relative flex justify-between items-center text-primary-800 text-base font-medium hover:bg-accent-100 hover:text-accent-900 cursor-pointer"
                                        >
                                            <Link
                                                href={`/courses?category=${category.title}&subCategory=${sub.title}`}
                                                className="w-full flex items-center px-3 py-[15px]"
                                            >
                                                {sub.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
