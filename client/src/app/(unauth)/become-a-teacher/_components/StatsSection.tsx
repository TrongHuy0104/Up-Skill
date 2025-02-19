'use client';

import React from 'react';

export default function StatsSection() {
    return (
        <section className="py-16  text-white text-center max-w-screen-xl mx-auto ">
            <div className="max-w-screen-xl mx-auto bg-primary-800 px-20 py-10 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Students */}
                    <div className=" py-8 px-4  shadow-lg">
                        <p className="text-4xl font-semibold">62M</p>
                        <p className="text-[15px]">Students</p>
                    </div>

                    {/* Languages */}
                    <div className=" py-8 px-4  shadow-lg">
                        <p className="text-4xl font-semibold">75+</p>
                        <p className="text-[15px]">Languages</p>
                    </div>

                    {/* Enrollments */}
                    <div className=" py-8 px-4  shadow-lg">
                        <p className="text-4xl font-semibold">830M</p>
                        <p className="text-[15px]">Enrollments</p>
                    </div>

                    {/* Countries */}
                    <div className=" py-8 px-4  shadow-lg">
                        <p className="text-4xl font-semibold">180+</p>
                        <p className="text-[15px]">Countries</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
