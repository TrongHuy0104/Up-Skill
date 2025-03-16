import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
    course: any;
    active: number;
    setActive: (active: number) => void;
};

function CourseProgressStep({ active, setActive, course }: Props) {
    const steps = ['Course Information', 'Course Options', 'Course Content', 'Course Preview'];

    const handleSelect = (index: number) => {
        const isCourseInfoValid =
            course.name &&
            course.description &&
            course.level &&
            course.category &&
            course.subCategory &&
            course.tags &&
            course.price &&
            course.thumbnail;

        const isCourseOptionsValid = course.benefits.length > 0 && course.prerequisites.length > 0;

        const isCourseContentValid = course.courseData.find(
            (c: any) => c.title && c.description && c.videoUrl && c.isPublished && c.isPublishedSection
        );
        if (index === 0) {
            return setActive(index);
        } else if (index === 1 && isCourseInfoValid) {
            return setActive(index);
        } else if (index === 2 && isCourseOptionsValid) {
            return setActive(index);
        } else if (index === 3 && isCourseContentValid && isCourseInfoValid && isCourseOptionsValid) {
            return setActive(index);
        }
    };

    return (
        <div className="w-full pt-2 pb-16 px-4">
            <div className="flex items-center justify-between relative">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
                    <div className="h-1 bg-primary-800"></div>
                </div>

                {/* Colored progress line segments */}
                <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 flex">
                    {steps.slice(0, -1).map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 ${index < active ? 'bg-accent-600' : 'bg-primary-800'}`}
                        ></div>
                    ))}
                </div>

                {steps.map((step, index) => {
                    const isCompleted = index <= active;
                    return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                            {/* Step circle */}
                            <button
                                onClick={() => handleSelect(index)}
                                className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-300 cursor-default ${
                                    isCompleted ? 'bg-accent-600' : 'bg-primary-800'
                                }`}
                            >
                                {isCompleted ? (
                                    <IoMdCheckmark className="text-white text-xl" />
                                ) : (
                                    <span className="text-white">{index + 1}</span>
                                )}
                            </button>

                            {/* Step label */}
                            <div className="absolute top-12 w-32 text-center">
                                <span className={`text-sm ${isCompleted ? 'text-accent-600' : 'text-primary-800'}`}>
                                    {step}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CourseProgressStep;
