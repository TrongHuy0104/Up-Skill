'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Search from '@/public/assets/icons/search.svg';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select';

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
            <div className="relative font-semibold">
                <Select>
                    <SelectTrigger className="w-[200px] h-[45.6px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>North America</SelectLabel>
                            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Europe & Africa</SelectLabel>
                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                            <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
                            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Asia</SelectLabel>
                            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                            <SelectItem value="ist_indonesia">Indonesia Central Standard Time (WITA)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Australia & Pacific</SelectLabel>
                            <SelectItem value="awst">Australian Western Standard Time (AWST)</SelectItem>
                            <SelectItem value="acst">Australian Central Standard Time (ACST)</SelectItem>
                            <SelectItem value="aest">Australian Eastern Standard Time (AEST)</SelectItem>
                            <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>South America</SelectLabel>
                            <SelectItem value="art">Argentina Time (ART)</SelectItem>
                            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SearchBar;
