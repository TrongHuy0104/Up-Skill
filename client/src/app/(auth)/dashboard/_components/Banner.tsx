'use client';

import React from 'react';
import Image from 'next/image';

import Banner from '@/components/ui/Banner';
import { layoutStyles } from '@/styles/styles';
import Avatar from '@/components/ui/Avatar';
import playOutlineIcon from '@/public/assets/icons/play-outline.svg';
import studentsIcon from '@/public/assets/icons/students.svg';
import starIcon from '@/public/assets/icons/star.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import defaultImage from '@/public/assets/images/avatar/user-3.png';
import CreateCourseForm from './CreateCourseForm';
import { Button } from '@/components/ui/Button';
import arrowIcon from '@/public/assets/icons/arrow-top-right.svg';
import useUserRedirect from '@/hooks/useUserRedirect';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

const InstructorDashboardBanner = () => {
    const { userData, isLoadingUser } = useUserRedirect();

    if (isLoadingUser) return <DashboardSkeleton />;

    const { user } = userData;

    return (
        <Banner
            contentAlignment="left"
            background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png" // Hình nền
        >
            <div className={`relative mx-auto w-[1428px] max-w-full px-[120px] py-[30px]`}>
                <div className={`${layoutStyles.row} items-center`}>
                    <div className="w-2/3">
                        <div className="flex items-center justify-start gap-[30px]">
                            <Avatar size={120} avatar={user?.avatar?.url || defaultImage} />
                            <div>
                                <h2 className="text-[42px] leading-[56px] mb-2 font-bold font-cardo">
                                    Welcome, <span>{user?.name}</span>
                                </h2>
                                {user?.role === 'instructor' && (
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
                                            <Image src={studentsIcon} className="relative bottom-[1px]" alt="" />
                                            <p>12k Enrolled Students</p>
                                        </div>
                                        <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                                            <Image src={playOutlineIcon} className="relative bottom-[1px]" alt="" />
                                            <p>25 Courses</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {user?.role === 'instructor' && (
                        <div className="w-1/3">
                            <CreateCourseForm />
                        </div>
                    )}
                    {user?.role === 'user' && (
                        <div className="w-1/3">
                            <Button variant="secondary" size="lg">
                                Become a teacher
                                <Image src={arrowIcon} alt=""></Image>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Banner>
    );
};

export default InstructorDashboardBanner;
