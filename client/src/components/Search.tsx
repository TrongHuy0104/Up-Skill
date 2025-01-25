'use client';

import Image from 'next/image';
import searchIcon from '@/public/assets/icons/search.svg';

export default function Search() {
    return (
        <div className="max-w-[600px] grow">
            <form action="#" className="relative z-30">
                <fieldset className="mb-0 w-full">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="shadow-none w-full py-2 px-5 pr-6 text-sm leading-7 bg-primary-50 border border-primary-100 rounded text-primary-600"
                        name="searchValue"
                    />
                </fieldset>
                <div className="absolute right-5 top-2/4 transform translate-y-[-50%] h-5">
                    <button type="submit" className="p-1 cursor-pointer">
                        <Image src={searchIcon} alt="Search Icon" className="relative -top-1 text-[21px]" />
                    </button>
                </div>
            </form>
        </div>
    );
}
