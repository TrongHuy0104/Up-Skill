import React from 'react';
import { layoutStyles } from '@/styles/styles';
import statImg from '@/public/assets/images/section/key-1.jpg';
import Image from 'next/image';

function Stats() {
    return (
        <section className={`${layoutStyles.container} mb-20 xl:mb-[140px]`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="flex flex-col xl:flex-row">
                        {/* Phần ảnh */}
                        <div className="w-full xl:w-1/2">
                            <Image
                                src={statImg}
                                alt="Success illustration"
                                className="w-full h-auto xl:h-full object-cover rounded-t-[12px] xl:rounded-l-[12px] xl:rounded-tr-none"
                            />
                        </div>
                        
                        {/* Phần nội dung */}
                        <div className="w-full xl:w-1/2 flex flex-col justify-center p-6 xl:p-[50px] xl:pr-[80px] xl:pl-[64px] bg-accent-100 rounded-b-[12px] xl:rounded-r-[12px] xl:rounded-bl-none">
                            <h2 className="font-bold text-2xl xl:text-4xl font-cardo mb-2 xl:leading-[50px]">
                                Learn The Secrets To Life Success, These People Have Got The Key.​
                            </h2>
                            <p className="text-sm xl:text-base leading-6 xl:leading-7 mb-4 xl:mb-6 px-4 xl:px-4">
                                Lorem ipsum dolor sit amet consectur adipiscing elit sed eiusmod ex tempor incididunt
                                labore dolore magna aliquaenim minim.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-y-6 xl:gap-x-[30px] px-4 xl:px-4">
                                {/* Các items thống kê */}
                                <div className="pl-3 xl:pl-[18px] text-start border-l-2 border-accent-900">
                                    <div className="text-lg xl:text-xl leading-[1.5] xl:leading-[30px] font-medium mb-1">2.5 Billion+</div>
                                    <span className="text-sm xl:text-base">Qualified Instructor</span>
                                </div>
                                <div className="pl-3 xl:pl-[18px] text-start border-l-2 border-accent-900">
                                    <div className="text-lg xl:text-xl leading-[1.5] xl:leading-[30px] font-medium mb-1">458,000+</div>
                                    <span className="text-sm xl:text-base">Course enrollments</span>
                                </div>
                                <div className="pl-3 xl:pl-[18px] text-start border-l-2 border-accent-900">
                                    <div className="text-lg xl:text-xl leading-[1.5] xl:leading-[30px] font-medium mb-1">78,000+</div>
                                    <span className="text-sm xl:text-base">Courses in 42 languages</span>
                                </div>
                                <div className="pl-3 xl:pl-[18px] text-start border-l-2 border-accent-900">
                                    <div className="text-lg xl:text-xl leading-[1.5] xl:leading-[30px] font-medium mb-1">563.000+</div>
                                    <span className="text-sm xl:text-base">Online Videos</span>
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