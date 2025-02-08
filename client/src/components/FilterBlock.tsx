'use client';

import { useState } from 'react';
import { IoIosStar } from 'react-icons/io';
import Image from 'next/image';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

type FilterBlockProps = {
    title: string;
    options: { label: string; count: number }[];
    type?: 'checkbox' | 'radio';
    name?: string;
};

function FilterBlock({ title, options, type = 'checkbox', name }: FilterBlockProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3);

    const visibleOptions = options.slice(0, visibleCount);

    const toggleOpen = () => setIsOpen(!isOpen);

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
                onClick={toggleOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleOpen()}
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
                        {visibleOptions.map((option) => (
                            <li key={option.label} className="flex items-center justify-between h-7">
                                <label className="flex items-center gap-2 text-sm text-primary-800 font-normal">
                                    <input
                                        type={type}
                                        name={type === 'radio' ? name : undefined}
                                        className="accent-primary-800 rounded w-4 h-4 cursor-pointer opacity-20 checked:opacity-100"
                                    />
                                    {title === 'Rating' ? renderStars(parseInt(option.label, 10)) : option.label}
                                </label>
                                <span className="text-xs text-primary-500">{`(${option.count})`}</span>
                            </li>
                        ))}
                    </ul>
                    {options.length > visibleCount && (
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
