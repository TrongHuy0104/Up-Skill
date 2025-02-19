"use client";
import Image from "next/image";
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';
import { useState } from "react";

interface SortByProps {
    options: { value: string; label: string }[];
    defaultValue?: string;
}

export default function SortBy({ options, defaultValue }: SortByProps) {
    const [selected, setSelected] = useState(defaultValue || options[0]?.label);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-[-8px]">
            <div className="flex flex-wrap items-center text-[15px]">
                <p
                    className="text-[15px] px-[7px] pl-10 text-primary-600 font-normal leading-[28px]"
                >
                    Sort by
                </p>
                <div
                    className="flex relative cursor-pointer text-primary-800 py-4 w-48 "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="block pr-4">{selected}</span>
                    {isOpen && (
                        <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected === option.label ? "text-accent-900 " : ""
                                        }`}
                                    onClick={() => {
                                        setSelected(option.label);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                    <Image src={arrowDownIcon} alt="arrow down icon"
                    />
                </div>

            </div>
        </div>
    );
}
