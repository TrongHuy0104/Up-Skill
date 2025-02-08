'use client';
import React, { useState } from 'react';

export default function CardList() {
    // State để theo dõi tab hiện tại
    const [activeTab, setActiveTab] = useState<string>('Most Popular');

    // Nội dung của các tab
    const tabsContent: Record<string, string> = {
        'Most Popular': 'Here are the most popular courses.',
        New: 'Here are the newest courses.',
        Trending: 'Here are the trending courses.'
    };

    return (
        <section className="w-[1400px] bg-primary-50 py-[48px]">
            <div className="tf-container mx-auto max-w-screen-xl px-[14px]">
                <div className="row flex flex-col items-start">
                    {/* Heading Section */}
                    <div className="col-span-12 w-full">
                        <div className="heading-section text-left mb-[37px]">
                            <h3 className="text-[26px] font-medium text-primary-800 leading-[1.2] ">
                                Courses to get you started
                            </h3>
                            <div className="text-primary-800 mt-2 ">
                                Explore courses from experienced, real-world experts.
                            </div>
                        </div>
                    </div>
                    {/* Tabs Section */}
                    <div className="w-[1400px] mx-auto">
                        <div className="flex justify-start text-[14px] font-medium text-primary-800 mb-4 ">
                            {['Most Popular', 'New', 'Trending'].map((tab) => (
                                <span
                                    key={tab}
                                    onClick={() => setActiveTab(tab)} // Khi bấm vào tab
                                    className={`mr-6 cursor-pointer pb-1 ${
                                        activeTab === tab
                                            ? 'border-b-[2px] border-accent-600 text-accent-700'
                                            : 'text-primary-800'
                                    }`}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>
                        {/* Nội dung tương ứng với tab */}
                        <div className="w-full text-primary-800 mt-4">
                            {tabsContent[activeTab] || 'Content not found.'}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
