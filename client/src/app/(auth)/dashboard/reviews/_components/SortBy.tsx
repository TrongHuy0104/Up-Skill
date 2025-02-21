"use client";
import Image from "next/image";
import arrowDownIcon from '@/public/assets/icons/arrow-dropdown.svg';
import { useState } from "react";

// Mark props as readonly
interface SortByProps {
    readonly options: readonly { value: string; label: string }[];
    readonly defaultValue?: string;
}

export default function SortBy({ options, defaultValue }: SortByProps) {
    const [selected, setSelected] = useState(defaultValue ?? options[0]?.label);
    const [isOpen, setIsOpen] = useState(false);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(!isOpen);
        } else if (event.key === "Escape") {
            setIsOpen(false);
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const currentIndex = options.findIndex(option => option.label === selected);
            const nextIndex = event.key === "ArrowDown"
                ? (currentIndex + 1) % options.length
                : (currentIndex - 1 + options.length) % options.length;
            setSelected(options[nextIndex].label);
        }
    };

    return (
        <div className="mt-[-8px]">
            <div className="flex flex-wrap text-[15px] ml-15">
                <p className="text-[15px] px-[7px] pl-10 text-primary-600 font-normal leading-[28px]">
                    Sort by
                </p>
                <button
                    className="flex relative items-center cursor-pointer text-primary-800 w-48 flex-end"
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="block pr-4">{selected}</span>

                    {isOpen && (
                        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    role="menuitem"
                                >
                                    <button
                                        className={`w-full text-left px-4 py-2 relative cursor-pointer hover:bg-gray-100 ${selected === option.label ? "text-accent-900" : ""
                                            }`}
                                        onClick={() => {
                                            setSelected(option.label);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Image src={arrowDownIcon} alt="arrow down icon" />
                </button>
            </div>
        </div>
    );
}
