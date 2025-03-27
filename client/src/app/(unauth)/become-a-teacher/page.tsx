import React from 'react';
import FirstBanner from './_components/FirstBanner';
import ManyReasons from './_components/ManyReasons';
import HowToBegin from './_components/HowToBegin';
import StatsSection from './_components/StatsSection';
import TestimonialCarousel from './_components/TestimonialCarousel';
import LastBanner from './_components/LastBanner';

export default function page() {
    return (
        <div>
            <FirstBanner />
            <ManyReasons />
            <HowToBegin />
            <StatsSection />
            <TestimonialCarousel />
            <LastBanner />
        </div>
    );
}
