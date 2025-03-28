'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

// Replace with the actual paths for the images of the users
import UserImage1 from '@/public/assets/images/avatar/user-4.png';
import UserImage2 from '@/public/assets/images/avatar/user-5.png';
import UserImage3 from '@/public/assets/images/avatar/user-6.png';
import Daden from '@/public/assets/images/section/become-instructor-1.png';
import check from '@/public/assets/icons/check-icon.svg';
import arrow from '@/public/assets/icons/arrow-top-right.svg';

export default function BecomeInstructor() {
    return (
        <section className="rounded-xl bg-accent-100 text-primary-800 text-center max-w-7xl mx-auto h-[326px] relative my-24">
            <div className="tf-container mx-auto w-full flex justify-between items-center gap-12 p-16 relative z-10 pr-20">
                {/* Phần Content (Bên trái) */}
                <div className="flex-1 text-left z-10  pr-10">
                    <h2 className="text-4xl font-bold font-cardo mb-4">Become An Instructor Today</h2>
                    <p className="text-[15px] text-primary-800 mb-8">
                        Top instructors from around the world teach millions of students on UpSkill. We provide the
                        tools and skills to teach what you love.
                    </p>

                    {/* Các mục tiêu dưới nút */}
                    <div className="flex justify-start gap-6 mb-6">
                        <div className="flex items-center">
                            <Image src={check} alt="check icon" width={20} height={20} />
                            <span className="ml-2">Earn money</span>
                        </div>
                        <div className="flex items-center">
                            <Image src={check} alt="check icon" width={20} height={20} />
                            <span className="ml-2">Inspire students</span>
                        </div>
                        <div className="flex items-center">
                            <Image src={check} alt="check icon" width={20} height={20} />
                            <span className="ml-2">Join our community</span>
                        </div>
                    </div>
                </div>

                {/* Phần Button (Giữa) */}
                <div className="flex-shrink-0 z-10 pr-80    ">
                    <div className="flex">
                        <Image
                            src={UserImage1}
                            alt="Instructor"
                            width={40}
                            height={40}
                            className="rounded-full  border-4 border-white outline outline-[1px] outline-accent-600 min-w-[40px] max-w[40px]"
                        />
                        <Image
                            src={UserImage2}
                            alt="Instructor"
                            width={40}
                            height={40}
                            className="rounded-full  border-4 border-white outline outline-[1px] outline-accent-600 min-w-[40px] max-w[40px]"
                        />
                        <Image
                            src={UserImage3}
                            alt="Instructor"
                            width={40}
                            height={40}
                            className="rounded-full  border-4 border-white outline outline-[1px] outline-accent-600 min-w-[40px] max-w[40px]"
                        />
                    </div>
                    <Button variant="default" className="px-6 py-3 cursor-pointer mt-12 text-[16px]">
                        Start Teaching Today
                        <Image src={arrow} alt="arrow icon" width={16} height={16} />
                    </Button>
                </div>
            </div>

            {/* Phần Hình ảnh (Bên phải) */}
            <div className="absolute bottom-0 right-0 z-0 mt-10 mr-10">
                <Image src={Daden} alt="Da Den" width={350} height={400} />
            </div>
        </section>
    );
}
