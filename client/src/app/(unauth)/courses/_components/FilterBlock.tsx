'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosStar } from 'react-icons/io';
import Image from 'next/image';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

type FilterBlockProps = {
    title: string;
    options: {
        label: string;
        count: number;
        key: string;
        subCategories?: { label: string; count: number; key: string }[];
    }[];
    type?: 'checkbox' | 'radio';
    name?: string;
};
function FilterBlock({ title, options, type = 'checkbox', name }: FilterBlockProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setSelectedCategories(getInitialSelectedCategories());
    }, [searchParams]);

    const paramMap: Record<string, string> = {
        Categories: 'category',
        Rating: 'rating',
        Price: 'price',
        Level: 'level',
        Language: 'language',
        Author: 'authorId'
    };
    const getInitialSelectedCategories = () => {
        const params = new URLSearchParams(searchParams.toString());
        const selectedSet = new Set<string>();

        options.forEach((option) => {
            const paramKey = paramMap[title] || 'filter';
            if (params.getAll(paramKey).includes(option.label)) {
                selectedSet.add(option.label);
            }
            option.subCategories?.forEach((sub) => {
                if (params.getAll('subCategory').includes(sub.label)) {
                    selectedSet.add(sub.label);
                }
            });
        });

        return selectedSet;
    };

    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(getInitialSelectedCategories);

    const toggleCategory = (
        event: React.ChangeEvent<HTMLInputElement>,
        optionKey: string,
        title: string,
        isSubCategory = false
    ) => {
        setSelectedCategories((prev) => {
            const newSet = new Set(prev);
    
            if (title === 'Rating') {
                newSet.clear();
            }
    
            if (newSet.has(optionKey)) {
                newSet.delete(optionKey);
            } else {
                newSet.add(optionKey);
            }
    
            return newSet;
        });
    
        const paramKey = isSubCategory ? 'subCategory' : paramMap[title] || 'filter';
        const params = new URLSearchParams(searchParams.toString());
    
        if (title === 'Rating') {
            params.delete(paramKey); 
            params.set(paramKey, optionKey);
        } else {
            const existingValues = new Set(params.getAll(paramKey));
    
            if (existingValues.has(optionKey)) {
                existingValues.delete(optionKey);
            } else {
                existingValues.add(optionKey);
            }
    
            params.delete(paramKey);
            existingValues.forEach((val) => params.append(paramKey, val));
        }
    
        router.replace(`?${params.toString()}`, { scroll: false });
    };
    

    const renderStars = (rating: number) => (
        <span className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <IoIosStar key={i} className={i < rating ? 'text-primary-800' : 'text-gray-300'} />
            ))}
        </span>
    );

    return (
        <div className="tf-sidebar-course bg-primary-50 border-b last:border-0 last:pb-0 last:mb-0 rounded-lg mb-6">
            <div
                className="flex justify-between items-center cursor-pointer h-10 mb-5"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <Image src={arrowDownIcon} alt="Arrow Down Icon" />
                </span>
            </div>

            <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 pb-5">
                    <ul className="flex flex-col gap-2">
                        {options?.slice(0, visibleCount)?.map((option) => (
                            <li key={option.key} className="flex flex-col">
                                <label className="flex items-center justify-between w-full text-sm text-primary-800 font-normal">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type={type}
                                            name={type === 'radio' ? name : undefined}
                                            className="accent-primary-800 rounded w-4 h-4 cursor-pointer opacity-20 checked:opacity-100"
                                            checked={selectedCategories.has(option.label)}
                                            onChange={(e) => toggleCategory(e, option.label, title)}
                                            value={option.label}
                                        />
                                        <span>
                                            {title === 'Rating'
                                                ? renderStars(parseInt(option.label, 10))
                                                : option.label}
                                        </span>
                                    </div>
                                    <span className="text-xs text-primary-500">({option.count})</span>
                                </label>

                                {selectedCategories.has(option.label) && option.subCategories && (
                                    <ul className="ml-6 mt-2">
                                        {option.subCategories.map((sub) => (
                                            <li key={sub.key} className="flex items-center justify-between h-7">
                                                <label className="flex items-center gap-2 text-sm text-primary-800">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-primary-800 rounded w-4 h-4 cursor-pointer opacity-20 checked:opacity-100"
                                                        checked={selectedCategories.has(sub.label)}
                                                        onChange={(e) => toggleCategory(e, sub.label, title, true)}
                                                        value={sub.label}
                                                    />
                                                    <span>{sub.label}</span>
                                                </label>
                                                <span className="text-xs text-primary-500">({sub.count})</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    {options?.length > visibleCount && (
                        <button
                            type="button"
                            className="flex items-center text-accent-600 hover:text-accent-800 mt-2"
                            onClick={() => setVisibleCount((prevCount) => prevCount + 3)}
                        >
                            <span className="mr-2">Show More</span>
                            <Image src={arrowDownOrangeIcon} alt="Arrow Down Orange Icon" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FilterBlock;
