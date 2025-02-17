import React from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

import CoursePlayer from './CoursePlayer';
import { Button } from '@/components/ui/Button';
import { formCreateCourseStyles } from '@/styles/styles';
import Ratings from './Ratings';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any;
};

function CoursePreview({ active, setActive, courseData, handleCourseCreate }: Props) {
    const discountPercentagePrice = (
        ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) *
        100
    ).toFixed(0);

    const prevButton = () => {
        setActive(active - 1);
    };

    const createCourse = () => {
        handleCourseCreate();
    };
    return (
        <>
            <div className="w-full relative">
                <div className="w-full mt-10">
                    <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.title} />
                </div>
                <div className="flex items-center mt-4 gap-3">
                    <span className="text-[26px] font-medium text-accent-900">
                        {courseData?.price === 0 ? 'Free' : courseData?.price + '$'}
                    </span>
                    <span className="line-through opacity-80">{`${courseData?.estimatedPrice}$`}</span>
                    <span className="rounded px-4 border border-accent-900 text-accent-900 bg-accent-100">
                        {discountPercentagePrice}% Off
                    </span>
                </div>
                <div className="flex items-center">
                    <Button className="!w-[160px] my-3 !bg-red-600 cursor-not-allowed">
                        Buy now {courseData?.price}$
                    </Button>
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
                        {courseData?.name}
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
                {courseData?.benefits?.map((item: any, index: number) => (
                    <div key={index} className="w-full flex py-2">
                        <div className="mr-1 w-[15px]">
                            <IoIosCheckmarkCircleOutline size={20} />
                        </div>
                        <p className="pl-2 text-ellipsis overflow-hidden">{item.title}</p>
                    </div>
                ))}
                <h1 className="text-[25px] font-cardo mt-5">What are the prerequisites for starting this course?</h1>
                {courseData?.prerequisites?.map((item: any, index: number) => (
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
                    <p className="mt-2 mb-6 whitespace-pre-line w-full overflow-hidden">{courseData?.description}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <Button onClick={prevButton} size="sm" type="submit">
                    <span>Back</span>
                </Button>
                <Button type="submit" size="sm" onClick={createCourse}>
                    <span>Create</span>
                </Button>
            </div>
        </>
    );
}

export default CoursePreview;
