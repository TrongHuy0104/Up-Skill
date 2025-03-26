import { layoutStyles } from '@/styles/styles';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import Link from 'next/link';
import { TfiArrowTopRight } from 'react-icons/tfi';
import CourseVerticalCard from '../custom/CourseCard';

interface MyCoursesProps {
    courses: any[];
    progressData: Record<string, number>;
}

const MyCourses = ({ courses, progressData }: MyCoursesProps) => {
    // Do not render anything if there are no courses
    if (courses.length === 0) return null;

    return (
        <section className="border-top border-primary-100 pb-[64px] pt-[80px]">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        <div className="mb-8 text-primary-800">
                            <h2 className="mb-2 font-bold font-cardo text-[36px] leading-[50px]">
                                Your Courses
                            </h2>
                            <div className="flex items-center justify-between gap-[10px] flex-wrap">
                                <span>Good learn good skill!</span>
                                <Link
                                    href="/courses"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Courses <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>
                            <div className="mt-6">
                                <Carousel className="w-full">
                                    <CarouselContent className="-ml-1">
                                        {courses.map((course) => (
                                            <CarouselItem key={course._id} className="pl-1 md:basis-1/2 lg:basis-1/5">
                                                <div className="p-1">
                                                    <CourseVerticalCard
                                                        course={course}
                                                        isProgress={true}
                                                        progress={progressData[course._id] || 0}
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyCourses;

