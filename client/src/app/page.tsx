import { cookies } from 'next/headers';

import TopCourses from '@/components/home/TopCourses';
import Hero from '@/components/home/Hero';
import WhyStudy from '@/components/home/WhyStudy';
import Stats from '@/components/home/Stats';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import TopInstructors from '@/components/home/TopInstructors';
import BecomeInstructor from '@/components/home/BecomeInstructor';

const Page = async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const [topCoursesResponse, topInstructorsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/top-courses`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/top-instructors`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        })
    ]);

    if (!topCoursesResponse.ok || !topInstructorsResponse.ok) {
        throw new Error('Failed to fetch data');
    }

    const {
        data: { topCourses }
    } = await topCoursesResponse.json();
    const { topInstructors } = await topInstructorsResponse.json();

    return (
        <div>
            <Hero />
            <TopCourses courses={topCourses} />
            <WhyStudy />
            <Stats />
            <TestimonialCarousel />
            <TopInstructors instructors={topInstructors} />
            <BecomeInstructor />
        </div>
    );
};

export default Page;
