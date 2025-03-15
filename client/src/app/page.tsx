import TopCourses from '@/components/home/TopCourses';
import Hero from '@/components/home/Hero';
import WhyStudy from '@/components/home/WhyStudy';
import Stats from '@/components/home/Stats';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import TopInstructors from '@/components/home/TopInstructors';
import BecomeInstructor from '@/components/home/BecomeInstructor';
import MyCourses from '@/components/home/MyCourses';

const Page = () => {
    return (
        <div>
            <Hero />
            <MyCourses />
            <TopCourses />
            <WhyStudy />
            <Stats />
            <TestimonialCarousel />
            <TopInstructors />
            <BecomeInstructor />
        </div>
    );
};

export default Page;