import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { TfiArrowTopRight } from 'react-icons/tfi';
import homeImg1 from '@/public/assets/images/section/become-instructor-1.png';
import homeImg2 from '@/public/assets/images/item/item-4.png';
import homeImg3 from '@/public/assets/images/item/item-20.png';
import { layoutStyles } from '@/styles/styles';
import { Button } from '../ui/Button';
import Image from 'next/image';
import Link from 'next/link';

function BecomeInstructor() {
    return (
        <section className={`${layoutStyles.container} mb-20 md:mb-[140px] px-4 sm:px-6`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-[60px] bg-accent-100 pt-8 md:pt-[71px] pr-4 md:pr-[10px] pb-8 md:pb-[76px] pl-6 md:pl-[80px] relative rounded-xl overflow-hidden">
                        {/* Content Section */}
                        <div className="flex flex-col max-w-full md:max-w-[567px] text-primary-800 z-10">
                            <h2 className="font-cardo font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.3] md:leading-[50px] mb-4 md:mb-[18px]">
                                Become An Instructor
                            </h2>
                            <p className="mb-6 md:mb-7 leading-6 md:leading-7 text-sm md:text-base">
                                Top instructors from around the world teach millions of students on UpSkill. We provide
                                the tools and skills to teach what you love
                            </p>
                            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 md:gap-0 mb-6 md:mb-0">
                                <li className="flex items-center gap-3 sm:gap-[15px] md:mr-[50px]">
                                    <FaCircleCheck size={18} className="min-w-[18px]" />
                                    Earn money
                                </li>
                                <li className="flex items-center gap-3 sm:gap-[15px] md:mr-[50px]">
                                    <FaCircleCheck size={18} className="min-w-[18px]" />
                                    Inspire students
                                </li>
                                <li className="flex items-center gap-3 sm:gap-[15px]">
                                    <FaCircleCheck size={18} className="min-w-[18px]" />
                                    Join our community
                                </li>
                            </ul>
                        </div>

                        {/* Button Section */}
                        <div className="md:my-auto z-10">
                            <Link href="/become-a-teacher">
                                <Button className="text-sm md:text-base w-full sm:w-auto">
                                    Start Teaching Today <TfiArrowTopRight className="relative top-[1px]" />
                                </Button>
                            </Link>
                        </div>

                        {/* Images Section */}
                        <div className="relative md:absolute md:right-6 lg:right-12 bottom-0 max-h-[300px] md:max-h-[400px] w-full md:max-w-[354px] mt-6 md:mt-0">
                            <Image 
                                src={homeImg1} 
                                alt="" 
                                className="h-auto w-full md:w-auto max-w-full align-middle" 
                            />
                            <Image 
                                src={homeImg2} 
                                alt="" 
                                className="hidden sm:block absolute top-[30%] left-[15%] w-12 sm:w-[60px] md:w-[74px]" 
                            />
                            <Image 
                                src={homeImg3} 
                                alt="" 
                                className="hidden sm:block absolute bottom-[25%] right-[5%] w-10 sm:w-[55px] md:w-[64px]" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BecomeInstructor;