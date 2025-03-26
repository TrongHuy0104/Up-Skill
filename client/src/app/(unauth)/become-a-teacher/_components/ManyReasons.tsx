'use client';
import React from 'react';
import Image from 'next/image'; // Import Image nếu bạn sử dụng Next.js

const reasons = [
    {
        title: 'Teach your way',
        description: 'What attracts the attention of the viewers is effective teaching and design.',
        icon: '/assets/icons/teach-your-way.svg' // Cập nhật đường dẫn icon
    },
    {
        title: 'Inspire learners',
        description: 'Provide feedback to help learners develop a new knowledge and improve.',
        icon: '/assets/icons/inspire-learners.svg' // Cập nhật đường dẫn icon
    },
    {
        title: 'Get rewarded',
        description: 'When your learners are successful, your efforts are effectively rewarded.',
        icon: '/assets/icons/get-rewarded.svg' // Cập nhật đường dẫn icon
    }
];

export default function ManyReasons() {
    return (
        <section className="py-16  text-center ">
            <h2 className="text-4xl font-bold font-cardo text-primary-800 mb-2">So Many Reasons To Start</h2>
            <p className="text-base text-primary-800 mb-4">Become a valuable expert with UpSkill.</p>
            <div className="flex justify-center gap-[100px]">
                {reasons.map((reason) => (
                    <div key={reason.title} className="flex flex-col items-center max-w-xs mx-8">
                        <div className="  p-6 mb-4">
                            <Image src={reason.icon} alt={reason.title} width={60} height={60} />
                        </div>
                        <h3 className="text-xl font-semibold text-primary-800 mb-2">{reason.title}</h3>
                        <p className="text-sm text-primary-800">{reason.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
