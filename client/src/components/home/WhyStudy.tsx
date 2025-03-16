import React from 'react';
import Image from 'next/image';

import { layoutStyles } from '@/styles/styles';
import whyStudyIcon1 from '@/public/assets/icons/why-study-1.svg';
import whyStudyIcon2 from '@/public/assets/icons/why-study-2.svg';
import whyStudyIcon3 from '@/public/assets/icons/why-study-3.svg';

function WhyStudy() {
    return (
        <section className={`${layoutStyles.container} pb-[140px]`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="mb-10 text-center text-primary-800">
                        <h2 className="mb-2 font-bold font-cardo text-4xl leading-[50px]">Why Study With Us?</h2>
                        <p>Become a valuable expert with UpSkill.</p>
                    </div>
                </div>
            </div>
            <div className={layoutStyles.row}>
                <div className="w-1/3">
                    <div className="text-center">
                        <div className="mb-[30px] flex justify-center">
                            <Image src={whyStudyIcon1} alt="" />
                        </div>
                        <div>
                            <h4 className="text-xl leading-[30px] mb-[14px] font-medium text-primary-800">
                                World Class Teachers
                            </h4>
                            <p>
                                What should be the structure of an effective <br />
                                websites and designs.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="mb-[42px] flex justify-center">
                        <Image src={whyStudyIcon2} alt="" />
                    </div>
                    <div>
                        <h4 className="text-xl leading-[30px] mb-[14px] font-medium text-primary-800 text-center">
                            Global Community
                        </h4>
                        <p className="text-center">
                            What should be the structure of an effective <br />
                            websites and designs.
                        </p>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className="mb-[42px] flex justify-center">
                        <Image src={whyStudyIcon3} alt="" />
                    </div>
                    <div>
                        <h4 className="text-xl leading-[30px] mb-[14px] font-medium text-primary-800 text-center">
                            Top Notch Courses
                        </h4>
                        <p className="text-center">
                            What should be the structure of an effective <br />
                            websites and designs.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyStudy;
