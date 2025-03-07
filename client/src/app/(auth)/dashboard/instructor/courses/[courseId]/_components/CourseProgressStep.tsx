import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';

type Props = {
    active: number;
    setActive: (active: number) => void;
};

function CourseProgressStep({ active, setActive }: Props) {
    const steps = ['Course Information', 'Course Options', 'Course Content', 'Course Preview'];

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
                                onClick={() => setActive(index)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-default ${
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
