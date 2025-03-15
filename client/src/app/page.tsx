import { cookies } from 'next/headers';

import TopCourses from '@/components/home/TopCourses';
import Hero from '@/components/home/Hero';
import WhyStudy from '@/components/home/WhyStudy';
import Stats from '@/components/home/Stats';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import TopInstructors from '@/components/home/TopInstructors';
import BecomeInstructor from '@/components/home/BecomeInstructor';
import MyCourses from '@/components/home/MyCourses';

const Page = async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    try {
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
            throw new Error('Failed to fetch main data');
        }

        const { data: { topCourses } } = await topCoursesResponse.json();
        const { topInstructors } = await topInstructorsResponse.json();

        // Fetch MyCourses data
        let myCourses = [];
        const progressData: Record<string, number> = {};
        let hasError400 = false;

        try {
            const myCoursesResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/purchased/my-course`, {
                credentials: 'include',
                headers: { Cookie: cookie }
            });

            if (myCoursesResponse.status === 400) {
                hasError400 = true;
            } else if (myCoursesResponse.ok) {
                const { data: { course } } = await myCoursesResponse.json();
                myCourses = course || [];

                if (myCourses.length > 0) {
                    const progressResponses = await Promise.all(
                        myCourses.map(async (course: any) => {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/progress/${course._id}`, {
                                credentials: 'include',
                                headers: { Cookie: cookie }
                            });

                            if (res.status === 400) {
                                hasError400 = true;
                                return null;
                            }

                            if (!res.ok) return null;

                            const data = await res.json();
                            return { id: course._id, progress: data.data?.completionPercentage || 0 };
                        })
                    );

                    progressResponses.forEach((item) => {
                        if (item) progressData[item.id] = item.progress;
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching MyCourses:', error);
            hasError400 = true;
        }

        return (
            <div>
                <Hero />
                {!hasError400 && <MyCourses courses={myCourses} progressData={progressData} />}
                <TopCourses courses={topCourses} />
                <WhyStudy />
                <Stats />
                <TestimonialCarousel />
                <TopInstructors instructors={topInstructors} />
                <BecomeInstructor />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Failed to load data</div>;
    }
};

export default Page;
