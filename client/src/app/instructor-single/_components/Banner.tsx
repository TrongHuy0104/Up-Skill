import React from 'react';
import Image from 'next/image';
import { layoutStyles } from '@/styles/styles';
import studentsIcon from '@/public/assets/icons/students.svg';
import starIcon from '@/public/assets/icons/star.svg';
import lessionsIcon from '@/public/assets/icons/lession.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import Banner from '@/components/ui/Banner';

const InstructorSingleBanner = async () => {
    const breadcrumbs = [{ href: '/', text: 'Home' }, { href: '/ages', text: 'Pages' }, { text: 'Instructor' }];
    return (
        <Banner
            contentAlignment="left"
            breadcrumbs={breadcrumbs}
            background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png" // Hình nền
        >
            <div className={`relative mx-auto w-[1428px] max-w-full px-[12px]`}>
                <div className={`${layoutStyles.row} items-center`}>
                    <div className="w-2/3">
                        <div className="flex items-center justify-start gap-[30px]">
                            <div>
                                <h2 className="text-[42px] leading-[56px] mb-2 font-bold font-cardo">
                                    Hi <span>I Am Ali Tufan</span>
                                </h2>
                                <div className="mb-4">
                                    <span>Developer and Teacher</span>
                                </div>
                                <div className="text-primary-800 gap-3 flex items-center justify-start flex-wrap">
                                    <div
                                        className='pr-[10px] relative flex items-center justify-start gap-[7px]
                                        after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                                    >
                                        <span>4.9</span>
                                        <div className="flex items-center relative gap-[7px] pb-[2px]">
                                            <Image src={starIcon} alt="" />
                                            <Image src={starIcon} alt="" />
                                            <Image src={starIcon} alt="" />
                                            <Image src={starIcon} alt="" />
                                            <Image src={starOutlineIcon} alt="" />
                                        </div>
                                        <p>315,475 rating</p>
                                    </div>
                                    <div
                                        className='pr-[10px] relative flex items-center justify-start gap-[7px]
                            after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                                    >
                                        <Image src={lessionsIcon} className="relative bottom-[1px]" alt="" />
                                        <p>11 Lessons</p>
                                    </div>
                                    <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                                        <Image src={studentsIcon} className="relative bottom-[1px]" alt="" />
                                        <p>200 Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Banner>
    );
};

export default InstructorSingleBanner;
