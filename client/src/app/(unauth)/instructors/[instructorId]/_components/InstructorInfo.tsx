'use client';
import React, { useState } from 'react';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import Image from 'next/image';

const CoursesDetailInfor = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-[900px]  mr-0 text-primary-800 ">
            {/* About This Course */}
            <section className="pb-[61px] leading-7 w-[900px]">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>

                {/* Nội dung có thể thu gọn */}
                <div className={`text-primary-800 ${isExpanded ? '' : 'line-clamp-6'}`}>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi aliquip commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur enim ipsum.
                    </p>
                    <p className="mt-4">
                        Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id
                        est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium totam rem aperiam. Excepteur sint occaecat cupidatat non proident sunt in
                        culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus
                        error sit voluptatem accusantium doloremque laudantium totam rem aperiam.Excepteur sint occaecat
                        cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam
                        rem aperiam.
                    </p>
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

export default CoursesDetailInfor;
