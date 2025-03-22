import React from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { formCreateCourseStyles } from '@/styles/styles';
import Ratings from './Ratings';
import VideoPlayer from './VideoPlayer';

type Props = {
    active: number;
    setActive: (active: number) => void;
    course: any;
};

function CoursePreview({ course }: Props) {
    const discountPercentagePrice = (((course?.estimatedPrice - course?.price) / course?.estimatedPrice) * 100).toFixed(
        0
    );



    return (
        <>
            <div className="w-full relative">
                <div className="w-full mt-10">
                    {!course?.demoUrl?.url ? (
                        <Image
                            src={course.thumbnail.url}
                            width={100}
                            height={100}
                            quality={100}
                            alt=""
                            className="object-cover w-full aspect-video"
                        />
                    ) : (
                        <VideoPlayer videoUrl={course?.demoUrl.url} />
                    )}
                </div>
                <div className="flex items-center mt-4 gap-3">
                    <span className="text-[26px] font-medium text-accent-900">
                        {course?.price === 0 ? 'Free' : course?.price + '$'}
                    </span>
                    <span className="line-through opacity-80">{`${course?.estimatedPrice}$`}</span>
                    <span className="rounded px-4 border border-accent-900 text-accent-900 bg-accent-100">
                        {discountPercentagePrice}% Off
                    </span>
                </div>
                <div className="flex items-center">
                    <Button className="!w-[160px] my-3 !bg-red-600 cursor-not-allowed">Buy now {course?.price}$</Button>
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        name=""
                        id=""
                        placeholder="Discount code..."
                        className={`${formCreateCourseStyles.input} !mt-0 py-5`}
                    />
                    <Button className="w-[120px] my-3 ml-4 cursor-pointer">Apply</Button>
                </div>
                <p className="pb-1 mt-2">• Source code included</p>
                <p className="pb-1">• Full lifetime access</p>
                <p className="pb-1">• Certificate of completion</p>
                <p className="pb-3">• Premium Support</p>
            </div>
            <div className="w-full">
                <div className="w-full">
                    <h1 className="text-[36px] leading-[56px] font-cardo font-semibold text-ellipsis overflow-hidden">
                        {course?.name}
                    </h1>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center">
                            <Ratings rating={0} />
                            <h5 className="relative top-[2px]">0 Review</h5>
                        </div>
                        <h5 className="relative top-[2px]">0 Student</h5>
                    </div>
                </div>
                <h1 className="text-[25px] font-cardo mt-5">What will you learn from this course?</h1>
                {course?.benefits?.map((item: any, index: number) => (
                    <div key={index} className="w-full flex py-2">
                        <div className="mr-1 w-[15px]">
                            <IoIosCheckmarkCircleOutline size={20} />
                        </div>
                        <p className="pl-2 text-ellipsis overflow-hidden">{item.title}</p>
                    </div>
                ))}
                <h1 className="text-[25px] font-cardo mt-5">What are the prerequisites for starting this course?</h1>
                {course?.prerequisites?.map((item: any, index: number) => (
                    <div key={index} className="w-full flex py-2">
                        <div className="mr-1 w-[15px]">
                            <IoIosCheckmarkCircleOutline size={20} />
                        </div>
                        <p className="pl-2 text-ellipsis overflow-hidden">{item.title}</p>
                    </div>
                ))}
                <br />
                <div className="w-full">
                    <h1 className="text-[25px] font-cardo">Course Details</h1>
                    <p className="mt-2 mb-6 whitespace-pre-line w-full overflow-hidden">{course?.description}</p>
                </div>
            </div>
        </>
    );
}

export default CoursePreview;
