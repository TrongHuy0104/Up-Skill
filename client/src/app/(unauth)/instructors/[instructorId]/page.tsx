import InstructorSingleBanner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfo from './_components/InstructorInfo';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';

export default function Page() {
    return (
        <div>
            <InstructorSingleBanner />
            <div className="relative w-full flex flex-col md:flex-row">
                <div className="mt-5 md:mt-6 lg:mt-8 w-[730px] max-w-full mx-auto">
                    <InstructorInfo />
                    <CoursesList />
                    <Review />
                </div>
                <div className="relative mt-[-50px] md:mt-[-100px] lg:mt-[-150px] w-full md:w-1/3">
                    <div className="sticky top-[20px]">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
