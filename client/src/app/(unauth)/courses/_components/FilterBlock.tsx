'use client';

import { useState, useEffect } from 'react';
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

const titleToQueryParam = {
    Categories: 'category',
    Rating: 'rating',
    'Sub Categories': 'subCategory',
    Level: 'level',
    Price: 'price',
    Author: 'authorId'
} as const;

function FilterBlock({ title, options, type = 'checkbox', name }: FilterBlockProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const router = useRouter();
    const searchParams = useSearchParams();

    const queryParam = titleToQueryParam[title as keyof typeof titleToQueryParam] || title.toLowerCase();

    // 🔥 Khi component mount, lấy params từ URL để set lại state
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const values = params.getAll(queryParam);
        setSelectedCategories(new Set(values));
    }, [searchParams, queryParam]);

    // Cập nhật URL khi selectedCategories thay đổi
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(queryParam);

        selectedCategories.forEach((key) => params.append(queryParam, key));
        router.push(`?${params.toString()}`, { scroll: false });
    }, [selectedCategories, queryParam, router, searchParams]);

    const toggleCategory = (categoryKey: string) => {
        setSelectedCategories((prev) => {
            const newSet = new Set(prev);

            if (queryParam === 'rating') {
                return new Set([categoryKey]); // Chỉ cho phép chọn 1 rating
            }

            if (newSet.has(categoryKey)) {
                newSet.delete(categoryKey);
            } else {
                newSet.add(categoryKey);
            }

            return newSet;
        });
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
                                            onChange={() => toggleCategory(option.label)}
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
                                                        onChange={() => toggleCategory(sub.label)}
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
