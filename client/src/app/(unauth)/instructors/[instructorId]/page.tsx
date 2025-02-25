import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import Banner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfo from './_components/InstructorInfo';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';

export default function Page() {
    return (
        <div className="max-w-[2500px] mx-auto">
            <Banner />
            <div className="relative w-full flex flex-col md:flex-row gap-8">
                <div className="mt-5 md:mt-6 lg:mt-8 w-full md:w-[1200px] mx-auto pl-[20px] md:pl-[100px] lg:pl-[200px]">
                    <InstructorInfo />
                    <CoursesDetailLine />
                    <CoursesList />
                    <CoursesDetailLine />
                    <Review />
                </div>
                <div className="relative -mt-[50px] md:-mt-[100px] lg:-mt-[150px] w-full ">
                    <div className="sticky top-[20px]">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
