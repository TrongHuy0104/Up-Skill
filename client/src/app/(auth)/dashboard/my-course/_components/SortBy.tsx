"use client";
import Image from "next/image";
import arrowDownIcon from '@/public/assets/icons/arrow-dropdown.svg';
import { useState, useRef, useEffect } from "react";

interface SortByProps {
    readonly options: readonly { value: string; label: string }[];
    readonly defaultValue?: string;
}

export default function SortBy({ options, defaultValue }: SortByProps) {
    const [selected, setSelected] = useState(defaultValue ?? options[0]?.label);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        <div className="relative flex justify-end" ref={dropdownRef}>
            <div className="flex items-center gap-2 flex-wrap"> 
                <p className="text-primary-600 text-[15px] min-w-20 text-right">
                    Sort by
                </p>
                <button
                    className="flex items-center justify-between gap-2 text-primary-800 min-w-30"
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="truncate">{selected}</span> 
                    <Image 
                        src={arrowDownIcon} 
                        alt="arrow down icon" 
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {isOpen && (
                <ul className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[192px]">
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selected === option.label ? 'text-accent-900 bg-gray-50' : ''}`}
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
        </div>
    );
}