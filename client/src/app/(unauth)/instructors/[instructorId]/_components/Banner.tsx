import React from 'react';
import Image from 'next/image';
import studentsIcon from '@/public/assets/icons/students.svg';
import starIcon from '@/public/assets/icons/star.svg';
import lessionsIcon from '@/public/assets/icons/lession.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import InstructorSingleBanner from './InstructorSingleBanner';


const Banner = async () => {
    const breadcrumbs = [{ href: '/', text: 'Home' }, { text: 'Instructor' }];
    return (
        <InstructorSingleBanner
            contentAlignment="left"
            breadcrumbs={breadcrumbs}
            background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png" // Hình nền
        >
            <div className="relative mx-auto w-full max-w-[1428px]">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-2/3">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-8">
                            <div>
                                {/* Tiêu đề */}
                                <h2 className="text-3xl sm:text-4xl md:text-[42px] leading-tight md:leading-[56px] mb-2 font-bold font-cardo">
                                    Hi <span>I Am Ali Tufan</span>
                                </h2>
                                {/* Mô tả */}
                                <div className="mb-4">
                                    <span>Developer and Teacher</span>
                                </div>
                                {/* Thông tin đánh giá, bài học, học viên */}
                                <div className="text-primary-800 gap-3 flex flex-wrap items-center justify-start">
                                    {/* Đánh giá */}
                                    <div className="pr-3 relative flex items-center justify-start gap-2 after:absolute after:content-[''] after:right-0 after:w-px after:h-4 after:bg-primary-100">
                                        <span>4.9</span>
                                        <div className="flex items-center relative gap-2 pb-0.5">
                                            <Image src={starIcon} alt="" width={15} height={15} />
                                            <Image src={starIcon} alt="" width={15} height={15} />
                                            <Image src={starIcon} alt="" width={15} height={15} />
                                            <Image src={starIcon} alt="" width={15} height={15} />
                                            <Image src={starOutlineIcon} alt="" width={15} height={15} />
                                        </div>
                                        <p>315,475 rating</p>
                                    </div>
                                    {/* Bài học */}
                                    <div className="pr-3 relative flex items-center justify-start gap-2 after:absolute after:content-[''] after:right-0 after:w-px after:h-4 after:bg-primary-100">
                                        <Image
                                            src={lessionsIcon}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="relative bottom-0.5"
                                        />
                                        <p>11 Lessons</p>
                                    </div>
                                    {/* Học viên */}
                                    <div className="pr-3 relative flex items-center justify-start gap-2">
                                        <Image
                                            src={studentsIcon}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="relative bottom-0.5"
                                        />
                                        <p>200 Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InstructorSingleBanner>
    );
};

export default Banner;
