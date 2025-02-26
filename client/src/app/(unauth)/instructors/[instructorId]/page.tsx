import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import Banner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfo from './_components/InstructorInfo';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';

export default function Page() {
    return (
        <div className="relative">
            <Banner />
            <div className="pt-[61px] flex  w-[1428px] mx-auto">
                {/* Content container */}
                <div className="flex max-w-screen-xl w-full px-4">
                    {/* Content section */}
                    <div className="mb-4 w-full md:w-3/4">
                        <InstructorInfo />
                        <CoursesDetailLine />
                        <CoursesList />
                        <CoursesDetailLine />
                        <Review />
                    </div>

                    {/* Sidebar with sticky positioning */}
                    <div className="md:w-[300px] md:-mt-[200px] w-full sticky top-5 self-start pb-12">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
