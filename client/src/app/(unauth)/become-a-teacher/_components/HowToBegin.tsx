'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'; // Import từ component Tabs
import Image from 'next/image'; // Nếu bạn sử dụng Next.js
import Image2People from '@/public/assets/images/page-title-home6.jpg';

export default function HowToBegin() {
    return (
        <section className="py-16 bg-white text-center">
            <h2 className="text-3xl font-bold font-cardo text-primary-800 mb-4">How To Begin</h2>
            <p className="text-lg text-primary-600 mb-8">
                Online video courses with new additions published every month.
            </p>

            {/* Tabs */}
            <Tabs defaultValue="curriculum">
                <div className="flex justify-center mb-10">
                    {/* Căn giữa */}
                    <TabsList className="flex gap-10">
                        {/* Tabs nằm trong một dòng và căn giữa */}
                        <TabsTrigger value="curriculum">Plan your curriculum</TabsTrigger>
                        <TabsTrigger value="video">Record your video</TabsTrigger>
                        <TabsTrigger value="course">Launch your course</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex justify-center gap-16 mb-16">
                    <TabsContent value="curriculum">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                            {/* Cột bên trái: Nội dung văn bản */}
                            <div className="flex flex-col justify-center text-left mx-24 h-full">
                                <p className="text-[15px] text-primary-800 mb-4">
                                    As it so contrasted oh estimating instrument. Size like body someone had. Are
                                    conduct viewing boy minutes warrant the expense? Tolerably behavior may admit
                                    daughters offending her ask own. Praise effect wishes change way and any wanted.
                                </p>
                                <h3 className="text-[15px] font-semibold text-primary-800 mb-2">How we help you</h3>
                                <p className="text-[15px] text-primary-800">
                                    We offer plenty of resources on how to create your first course. And, our instructor
                                    dashboard and curriculum pages help keep you organized.
                                </p>
                            </div>

                            {/* Cột bên phải: Hình ảnh */}
                            <div className="flex justify-center items-center">
                                <Image
                                    src={Image2People} // Thay bằng đường dẫn tới hình ảnh
                                    alt="Illustration showing process"
                                    width={560}
                                    height={490}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="video">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                            {/* Cột bên trái: Nội dung văn bản */}
                            <div className="flex flex-col justify-center text-left mx-24 h-full">
                                <p className="text-[15px] text-primary-800 mb-4">
                                    Recording your videos can be done in many ways. You may use a camera or screen
                                    recording tools. Ensure you have good lighting and sound for clarity.
                                </p>
                                <h3 className="text-[15px] font-semibold text-primary-800 mb-2">How we help you</h3>
                                <p className="text-[15px] text-primary-800">
                                    We offer plenty of resources on how to create your first course. And, our instructor
                                    dashboard and curriculum pages help keep you organized.
                                </p>
                            </div>

                            {/* Cột bên phải: Hình ảnh */}
                            <div className="flex justify-center items-center">
                                <Image
                                    src={Image2People} // Thay bằng đường dẫn tới hình ảnh
                                    alt="Illustration showing process"
                                    width={560}
                                    height={490}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="course">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                            {/* Cột bên trái: Nội dung văn bản */}
                            <div className="flex flex-col justify-center text-left mx-24 h-full">
                                <p className="text-[15px] text-primary-800 mb-4">
                                    Launching your course is exciting! Make sure your content is well-organized and easy
                                    to navigate. Add engaging resources to attract learners.
                                </p>
                                <h3 className="text-[15px] font-semibold text-primary-800 mb-1">How we help you</h3>
                                <p className="text-[15px] text-primary-800">
                                    We offer plenty of resources on how to create your first course. And, our instructor
                                    dashboard and curriculum pages help keep you organized.
                                </p>
                            </div>

                            {/* Cột bên phải: Hình ảnh */}
                            <div className="flex justify-center items-center">
                                <Image
                                    src={Image2People} // Thay bằng đường dẫn tới hình ảnh
                                    alt="Illustration showing process"
                                    width={560}
                                    height={490}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </section>
    );
}
