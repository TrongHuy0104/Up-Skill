import React from 'react';
import Bannerr from '../../../components/ui/Banner';

export default function Banner() {
    const breadcrumbs = [
        { href: '/', text: 'Home' },
        { href: '/development', text: 'Development' },
        { text: 'Web Development' }
    ];

    return (
        <Bannerr
            title="Web Development Courses"
            breadcrumbs={breadcrumbs}
            contentAlignment="left"
            backgroundColor="bg-accent-100"
        >
            <p className=" text-primary-800 mb-[43px]">
                With one of our online web development courses, you can explore different areas of this in-demand field.
            </p>
        </Bannerr>
    );
}
