'use client';
import React, { useState } from 'react';
import check from '@/public/assets/icons/check-icon.svg';
import arrowDownOrangeIcon from '@/public/assets/icons/arrow-down-orange.svg';
import Image from 'next/image';

const CoursesDetailInfor = () => {
    // State để kiểm soát trạng thái thu gọn/mở rộng
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-[900px] px-[14px] mr-0 text-primary-800">
            <div className="border-t border-primary-100 mb-[61px] w-[900px] px-[14px]"></div>

            {/* What you\'ll learn */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">What you&apos;ll learn</h2>
                <div className="grid grid-cols-2 gap-4 pb-[61px]">
                    <div className="space-y-2">
                        {[...Array(5)].map((_, index) => (
                            <div key={`item-${index}`} className="flex gap-2">
                                <Image alt="Check Icon" src={check} />
                                <p>Prepare for Industry Certification Exam</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, index) => (
                            <div key={`item-${index}`} className="flex gap-2">
                                <Image alt="Check Icon" src={check} />
                                <p>Prepare for Industry Certification Exam</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-primary-100 mb-[61px] w-[900px] px-[14px]"></div>
            </section>

            {/* Requirements */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="list-disc pl-6 space-y-2 pb-[61px]">
                    <li>
                        There are no skill prerequisites for this course although it&apos;s helpful if you are familiar
                        with operating your internet.
                    </li>
                    <li>You can take this course using a Mac, PC or Linux machine.</li>
                    <li>It is recommended that you download the free Komodo text editor.</li>
                </ul>
                <div className="border-t border-primary-100 mb-[61px] w-[900px] px-[14px]"></div>
            </section>

            {/* About This Course */}
            <section className="pb-[61px] leading-7">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>

                {/* Nội dung có thể thu gọn */}
                <div className={`text-primary-800 ${isExpanded ? '' : 'line-clamp-6'}`}>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua enim ad minim veniam, quis nostrud exerc tation ullamco laboris
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
            <div className="border-t border-primary-100 mb-[61px] w-[900px] px-[14px]"></div>
        </div>
    );
};

export default CoursesDetailInfor;
