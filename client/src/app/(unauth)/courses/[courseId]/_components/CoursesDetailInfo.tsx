'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import check from '@/public/assets/icons/check-icon.svg';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import CoursesDetailLine from '@/components/custom/CoursesDetailLine';

interface Props {
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    description: string;
}

const CoursesDetailInfo = ({ benefits, prerequisites, description }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full mx-auto sm: mr-0 text-primary-800 ">
            {/* What you'll learn */}
            <section className="mb-[61px] w-full ">
                <h2 className="text-2xl font-bold mb-4 font-cardo">What you will learn</h2>
                <div className="pb-[61px]">
                    <div className="grid md:grid-cols-2 gap-3">
                        {benefits?.map((item, index) => (
                            <div key={item.title + index} className="flex gap-2">
                                <Image alt="Check Icon" src={check} />
                                <p>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <CoursesDetailLine />
            </section>

            {/* Requirements */}
            <section className="mb-[61px] w-full ">
                <h2 className="text-2xl font-bold mb-4 font-cardo">Requirements</h2>
                <ul className="list-disc pl-6 pb-[61px] grid md:grid-cols-2 gap-y-3 gap-x-6">
                    {prerequisites?.map((prerequisite, index) => (
                        <li key={prerequisite.title + index}>{prerequisite.title}</li>
                    ))}
                </ul>
                <CoursesDetailLine />
            </section>

            {/* About This Course */}
            <section className="pb-[61px] leading-7 w-full  mx-auto">
                <h2 className="text-2xl font-bold mb-4 font-cardo">About This Course</h2>

                {/* Nội dung có thể thu gọn */}
                <div className={`text-primary-800 ${isExpanded ? '' : 'line-clamp-6'}`}>
                    <p>{description}</p>
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
};

export default CoursesDetailInfo;
