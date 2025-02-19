import React from 'react';
import { layoutStyles } from '@/styles/styles';
import statImg from '@/public/assets/images/section/key-1.jpg';
import Image from 'next/image';

function Stats() {
    return (
        <section className={`${layoutStyles.container} mb-[140px]`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="flex">
                        <div className="w-1/2">
                            <Image
                                src={statImg}
                                alt=""
                                className="w-full h-full object-cover border rounded-l-[12px]"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-[50px] pr-[80px] pl-[64px] bg-accent-100 rounded-r-[12px] rounded-l-none w-1/2 text-primary-800">
                            <h2 className="font-bold text-4xl font-cardo mb-2 leading-[50px]">
                                Learn The Secrets To Life Success, These People Have Got The Key.​
                            </h2>
                            <p className="text-base leading-7 mb-6">
                                Lorem ipsum dolor sit amet consectur adipiscing elit sed eiusmod ex tempor incididunt
                                labore dolore magna aliquaenim minim.
                            </p>
                            <div className="flex flex-wrap gap-y-6 gap-x-[30px] justify-start">
                                <div className="pl-[18px] text-start min-w-[250px] border-l-2 border-accent-900">
                                    <div className="text-xl leading-[30px] font-medium mb-1">2.5 Billion+</div>
                                    <span>Qualified Instructor</span>
                                </div>
                                <div className="pl-[18px] text-start min-w-[250px] border-l-2 border-accent-900">
                                    <div className="text-xl leading-[30px] font-medium mb-1">458,000+</div>
                                    <span>Course enrollments</span>
                                </div>
                                <div className="pl-[18px] text-start min-w-[250px] border-l-2 border-accent-900">
                                    <div className="text-xl leading-[30px] font-medium mb-1">78,000+</div>
                                    <span>Courses in 42 languages</span>
                                </div>
                                <div className="pl-[18px] text-start min-w-[250px] border-l-2 border-accent-900">
                                    <div className="text-xl leading-[30px] font-medium mb-1">563.000+</div>
                                    <span>Online Videos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Stats;
