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
        <section className={`${layoutStyles.container} mb-[140px]`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="flex gap-[60px] bg-accent-100 pt-[71px] pr-[10px] pb-[76px] pl-[80px] relative flex-wrap rounded-xl">
                        <div className="flex max-w-[567px] flex-col text-primary-800">
                            <h2 className="font-cardo font-bold text-4xl leading-[50px] mb-[18px]">
                                Become An Instructor
                            </h2>
                            <p className="mb-7 leading-7">
                                Top instructors from around the world teach millions of students on UpSkill. We provide
                                the tools and skills to teach what you love
                            </p>
                            <ul className="flex">
                                <li className="flex items-center gap-[15px] mr-[50px]">
                                    <FaCircleCheck size={20} />
                                    Earn money
                                </li>
                                <li className="flex items-center gap-[15px] mr-[50px]">
                                    <FaCircleCheck size={20} />
                                    Inspire students
                                </li>
                                <li className="flex items-center gap-[15px]">
                                    <FaCircleCheck size={20} />
                                    Join our community
                                </li>
                            </ul>
                        </div>
                        <div className="my-auto">
                            <Link href="/become-instructor">
                                <Button className="text-base">
                                    Start Teaching Today <TfiArrowTopRight className="relative top-[1px]" />
                                </Button>
                            </Link>
                        </div>
                        <div className="absolute right-12 bottom-0 max-h-[400px] max-w-[354px]">
                            <Image src={homeImg1} alt="" className="h-auto max-w-full align-middle" />
                            <Image src={homeImg2} alt="" className="absolute top-[148px] left-[52px] w-[74px]" />
                            <Image src={homeImg3} alt="" className="absolute bottom-[136px] right-0 w-[64px]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BecomeInstructor;
