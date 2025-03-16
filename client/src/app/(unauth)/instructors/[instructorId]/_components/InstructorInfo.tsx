'use client';
import React, { useState } from 'react';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import Image from 'next/image';

import { User } from '@/types/User';
interface Props {
    readonly user: User;
}

export default function InstructorInfo({ user }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-[900px]  mr-0 text-primary-800 ">
            {/* About This Course */}
            <section className="pb-[61px] leading-7 w-[900px]">
                <h2 className="text-2xl font-cardo mb-4">About My Self</h2>

                {/* Nội dung có thể thu gọn */}
                <div className={`text-primary-800 ${isExpanded ? '' : 'line-clamp-6'}`}>
                    <p>{user.introduce}</p>
                </div>

                {/* Nút Show More / Show Less */}
                <button
                    type="button"
                    className="flex items-center text-accent-600 hover:text-accent-800 mt-2 pt-3"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span className="mr-2">{isExpanded ? 'Hide' : 'Show More'}</span>
                    <Image
                        src={arrowDownOrangeIcon}
                        alt="Arrow Down Icon"
                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </section>
        </div>
    );
}
