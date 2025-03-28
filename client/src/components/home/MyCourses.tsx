'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TfiArrowTopRight } from 'react-icons/tfi';
import { useSelector } from 'react-redux';

import { layoutStyles } from '@/styles/styles';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import CourseVerticalCard from '../custom/CourseCard';
import { VerticalCardSkeleton } from '../ui/Skeleton';

const MyCourses = () => {
    const { isLoggingOut } = useSelector((state: any) => state.auth);
    const [courses, setCourses] = useState<any[]>([]);
    const [progressData, setProgressData] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch courses and progress data
    useEffect(() => {
        if (isLoggingOut) {
            setCourses([]);
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const cookie = document.cookie; // Access cookies on the client side

                // Fetch purchased courses
                const myCoursesResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/purchased/my-course`,
                    {
                        credentials: 'include',
                        headers: { Cookie: cookie }
                    }
                );

                if (!myCoursesResponse.ok || myCoursesResponse.status === 400) {
                    throw new Error('Failed to fetch courses');
                }

                const {
                    data: { course: myCourses = [] }
                } = await myCoursesResponse.json();

                if (myCourses.length === 0) {
                    setIsLoading(false);
                    return;
                }

                // Fetch progress for each course
                const progressResponses = await Promise.all(
                    myCourses.map(async (course: any) => {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/progress/${course._id}`, {
                            credentials: 'include',
                            headers: { Cookie: cookie }
                        });

                        if (!res.ok || res.status === 400) return null;

                        const data = await res.json();
                        return { id: course._id, progress: data.data?.completionPercentage || 0 };
                    })
                );

                // Combine progress data into a single object
                const progressData = progressResponses.reduce(
                    (acc, item) => {
                        if (item) acc[item.id] = item.progress;
                        return acc;
                    },
                    {} as Record<string, number>
                );

                setCourses(myCourses);
                setProgressData(progressData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isLoggingOut]);

    // Render skeleton loading state
    if (isLoading) {
        return (
            <Carousel className={`w-full ${layoutStyles.container}`}>
                <CarouselContent className="-ml-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <CarouselItem key={i} className="pl-1 md:basis-1/2 lg:basis-1/5">
                            <VerticalCardSkeleton />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        );
    }

    // Do not render anything if there are no courses
    if (courses.length === 0) return null;

    return (
        <section className="border-t border-primary-100 pb-[64px] pt-[80px] sm:px-4">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        <div className="mb-8 text-primary-800">
                            <h2 className="mb-2 font-bold font-cardo text-[36px] leading-[50px]">Your Courses</h2>
                            <div className="flex items-center justify-between gap-[10px] flex-wrap">
                                <span>Good learn good skill!</span>
                                <Link
                                    href="/courses"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Courses <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>

                            <Carousel className="relative mt-6">
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                                    {courses.map((course) => (
                                        <div
                                            key={course._id}
                                            className="snap-start shrink-0 w-[80%] sm:w-[60%] md:w-[45%] lg:w-[20%] px-2"
                                        >
                                            <CourseVerticalCard
                                                course={course}
                                                isProgress={true}
                                                progress={progressData[course._id] || 0}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyCourses;
