import React from 'react';
import Banner from '@/components/ui/Banner';

export default function CourseListBanner() {
    const breadcrumbs = [
        { href: '/', text: 'Home' },
        { href: '/development', text: 'Development' },
        { text: 'Web Development' }
    ];

    return (
        <Banner
            title="Web Development Courses"
            breadcrumbs={breadcrumbs}
            contentAlignment="left"
            backgroundColor="bg-accent-100"
        >
            <p className=" text-primary-800 mb-[10px] text-sm md:text-base">
                With one of our online web development courses, you can explore different areas of this in-demand field.
            </p>
        </Banner>
    );
}
