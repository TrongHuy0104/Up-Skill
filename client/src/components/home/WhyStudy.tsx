import React from 'react';
import Image from 'next/image';

import { layoutStyles } from '@/styles/styles';
import whyStudyIcon1 from '@/public/assets/icons/why-study-1.svg';
import whyStudyIcon2 from '@/public/assets/icons/why-study-2.svg';
import whyStudyIcon3 from '@/public/assets/icons/why-study-3.svg';

function WhyStudy() {
    return (
        <section className={`${layoutStyles.container} pb-20 md:pb-[140px]`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="mb-10 text-center text-primary-800">
                        <h2 className="mb-2 font-bold font-cardo text-3xl md:text-4xl leading-[1.3] md:leading-[50px]">
                            Why Study With Us?
                        </h2>
                        <p className="text-sm md:text-base">Become a valuable expert with UpSkill.</p>
                    </div>
                </div>
            </div>
            <div className={`${layoutStyles.row} flex flex-col md:flex-row`}>
                {/* Item 1 */}
                <div className="w-full md:w-1/3 mb-10 md:mb-0">
                    <div className="text-center">
                        <div className="mb-6 md:mb-[30px] flex justify-center">
                            <Image src={whyStudyIcon1} alt="World Class Teachers" />
                        </div>
                        <div>
                            <h4 className="text-xl leading-[1.5] mb-3 md:mb-[14px] font-medium text-primary-800">
                                World Class Teachers
                            </h4>
                            <p className="text-sm md:text-base px-4 md:px-0">
                                What should be the structure of an effective <br className="hidden md:block" />
                                websites and designs.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Item 2 */}
                <div className="w-full md:w-1/3 mb-10 md:mb-0">
                    <div className="text-center">
                        <div className="mb-6 md:mb-[30px] flex justify-center">
                            <Image src={whyStudyIcon2} alt="Global Community" />
                        </div>
                        <div>
                            <h4 className="text-xl leading-[1.5] mb-3 md:mb-[14px] font-medium text-primary-800">
                                Global Community
                            </h4>
                            <p className="text-sm md:text-base px-4 md:px-0">
                                What should be the structure of an effective <br className="hidden md:block" />
                                websites and designs.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Item 3 */}
                <div className="w-full md:w-1/3">
                    <div className="text-center">
                        <div className="mb-6 md:mb-[30px] flex justify-center">
                            <Image src={whyStudyIcon3} alt="Top Notch Courses" />
                        </div>
                        <div>
                            <h4 className="text-xl leading-[1.5] mb-3 md:mb-[14px] font-medium text-primary-800">
                                Top Notch Courses
                            </h4>
                            <p className="text-sm md:text-base px-4 md:px-0">
                                What should be the structure of an effective <br className="hidden md:block" />
                                websites and designs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyStudy;