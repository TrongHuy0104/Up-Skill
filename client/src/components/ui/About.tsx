import React from 'react';
import Image from 'next/image';
import sectionKey from '@/public/assets/images/section/key-1.jpg';
import { Cardo, DM_Sans } from 'next/font/google';
import { cn } from '@/utils/helpers';

const cardo = Cardo({ subsets: ['latin'], variable: '--font-cardo', weight: ['400', '700'] });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmSans' });

const About = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-[686px] h-[650px] flex-shrink-0">
                <Image src={sectionKey} alt="section" className="rounded-l-lg object-cover w-full h-full" />
            </div>

            <div className="w-[686px] h-[650px] bg-[#FFEFEA] flex flex-col rounded-r-lg p-12 space-y-[23px] text-left justify-center">
                <h1 className={cn(cardo.variable, 'text-[36px]  text-[#131836]')}>
                    Learn The Secrets To Life Success, <br /> These People Have Got The Key.
                </h1>

                <p className={cn(dmSans.variable, 'text-[18px] text-[#131836] mt-2')}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod ex tempor incididunt labore
                    dolore magna aliqua enim minim.
                </p>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-8">
                    {[
                        { id: 1, number: '458,000+', label: 'Qualified Instructor' },
                        { id: 2, number: '2.5 Billion+', label: 'Course enrolments' },
                        { id: 3, number: '78,000+', label: 'Courses in 42 languages' },
                        { id: 4, number: '563,000+', label: 'Online Videos' }
                    ].map((item) => (
                        <div key={item.id} className="flex items-start relative pl-4">
                            <div className="absolute left-0 bottom-0 top-0 w-[1.5px] bg-[#E27447] transition-all h-auto"></div>
                            <div>
                                <p className={cn(dmSans.variable, 'text-[20px] text-[#131836]')}>{item.number}</p>
                                <p className={cn(dmSans.variable, 'text-[15px] text-[#131836]')}>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
