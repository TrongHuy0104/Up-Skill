import InstructorSingleBanner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfor from './_components/InstructorInfor';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';

export default function Page() {
    return (
        <div>
            <div className="relative">
                <InstructorSingleBanner />
                <div className="fixed  right-10 transform -translate-y-[150px] -translate-x-[190px] z-10">
                    <Sidebar />
                </div>
            </div>
            <div className="w-[900px] pl-[240px] mt-[80px]">
                <div>
                    <InstructorInfor />
                    <CoursesList />
                    <Review/>
                </div>
            </div>
        </div>
    );
}
