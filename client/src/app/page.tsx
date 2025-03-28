import TopCourses from '@/components/home/TopCourses';
import Hero from '@/components/home/Hero';
import WhyStudy from '@/components/home/WhyStudy';
import Stats from '@/components/home/Stats';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import TopInstructors from '@/components/home/TopInstructors';
import BecomeInstructor from '@/components/home/BecomeInstructor';
import MyCourses from '@/components/home/MyCourses';
import VoiceflowChatWidget from '@/components/custom/VoiceflowChatWidget';

const fetchData = async (url: string) => {
    const response = await fetch(url, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.json();
};

const Page = async () => {
    try {
        const [topCoursesData, topInstructorsData] = await Promise.all([
            fetchData(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/top-courses`),
            fetchData(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/top-instructors`)
        ]);

        return (
            <div>
                <Hero />
                <MyCourses />
                <TopCourses courses={topCoursesData.data.topCourses} />
                <WhyStudy />
                <Stats />
                <TestimonialCarousel />
                <TopInstructors instructors={topInstructorsData.topInstructors} />
                <BecomeInstructor />
                <VoiceflowChatWidget />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Failed to load data</div>;
    }
};

export default Page;
