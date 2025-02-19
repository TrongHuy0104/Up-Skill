import React from 'react';
import { IoIosFlash } from 'react-icons/io';
import { TfiArrowTopRight } from 'react-icons/tfi';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';

import { layoutStyles } from '@/styles/styles';
import { Button } from '../ui/Button';
import heroImg1 from '@/public/assets/images/page-title/page-title-home1.png';
import heroImg2 from '@/public/assets/images/item/item-1.png';
import heroImg3 from '@/public/assets/images/item/item-2.png';
import heroImg4 from '@/public/assets/images/item/item-3.png';

function Hero() {
    return (
        <section className={layoutStyles.container}>
            <div className={layoutStyles.row}>
                <div className="w-7/12 px-[14px] flex-auto">
                    <div className="py-[150px]">
                        <div className="mb-[22px] flex items-center justify-start w-max pl-1 pr-6 py-1 rounded-full border border-primary-100 bg-primary-50 gap-2">
                            <div className="flex items-center justify-center h-[30px] w-[30px] text-accent-900 bg-accent-100 rounded-full">
                                <IoIosFlash size={18} />
                            </div>
                            <p>The Leader in Online Learning</p>
                        </div>
                        <h1 className="font-cardo font-bold text-[60px] leading-[81px] mb-[10px] text-primary-800">
                            Get <span className="text-accent-900">2500+</span> Best Online Courses From UpSkill
                        </h1>
                        <p className="text-base leading-7 text-primary-800 mb-[31px]">
                            Start, switch, or advance your career with more than 5,000 courses,
                            <br />
                            Professional Certificates, and degrees from world-class universities and
                            <br />
                            companies.
                        </p>
                        <div className="flex flex-wrap gap-y-[30px] gap-x-[18px]">
                            <Button className="text-base">
                                Get Started <TfiArrowTopRight className="relative top-[1px]" />
                            </Button>
                            <Button
                                variant={'outline'}
                                className="text-base border-primary-800 hover:bg-primary-800 hover:text-primary-50"
                            >
                                Explore courses <TfiArrowTopRight className="relative top-[1px]" />
                            </Button>
                            <div className="flex flex-col gap-[10px] pt-1 ml-1">
                                <div className="flex text-accent-900 gap-[10px]">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                                <div className="leading-[18px]">35k+ happy students</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-5/12 px-[14px] flex-auto">
                    <div className="relative max-w-[480px] ml-auto mt-[46px]">
                        <Image src={heroImg1} alt="" />
                        <Image
                            src={heroImg2}
                            alt=""
                            className="absolute top-[53px] left-[-57px] w-[121px] animate-rotate-tilt"
                        />
                        <Image
                            src={heroImg3}
                            alt=""
                            className="absolute bottom-[74px] -left-5 w-[108px] animate-slide-in"
                        />
                        <Image
                            src={heroImg4}
                            alt=""
                            className="absolute bottom-[55px] -right-6 w-[115px] animate-slide-up"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
