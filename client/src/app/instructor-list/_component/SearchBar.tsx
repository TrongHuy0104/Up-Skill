'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Search from '@/public/assets/icons/search.svg';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex items-center space-x-4 ">
            {/* Search Input */}
            <div className="relative flex-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for anything"
                    className="w-[300px] py-3 pl-5 pr-12 rounded-lg border-[1px] border-primary-100  bg-white text-primary-800 text-sm"
                />
                <button className="absolute top-1/2 right-3 transform -translate-y-1/2">
                    <Image src={Search} alt="Search Icon" className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
                <select className="w-[110px] py-3 px-3 border-[1px] border-primary-100 rounded-lg text-sm font-semibold text-primary-800 hover:bg-accent-100 bg-white">
                    <option>Category</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>Marketing</option>
                </select>
            </div>
        </div>
    );
};

export default SearchBar;
