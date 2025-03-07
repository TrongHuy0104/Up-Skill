'use client';

import { useState } from 'react';

import CourseData from './CourseData';
import CoursePreview from './CoursePreview';
import CourseProgressStep from './CourseProgressStep';
import CourseInformation from './CourseInformation';
import { useGetUploadedCourseByInstructorQuery } from '@/lib/redux/features/course/courseApi';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import CourseSections from './CourseSections';
import EditSection from './EditSection';
import EditLesson from './EditLesson';
import PublishCourseStatus from './PublishCourseStatus';

interface CreateEditCourseProps {
    courseId: string;
    categories: {
        label: string;
        value: string;
        subCategories: {
            label: string;
            value: string;
        }[];
    }[];
    levels: {
        label: string;
        value: string;
    }[];
}

function CreateEditCourse({ levels, categories, courseId }: CreateEditCourseProps) {
    // Mutation + Query
    const {
        data: courseResponse,
        isLoading: isGettingCourse,
        refetch: refetchCourse
    } = useGetUploadedCourseByInstructorQuery(courseId, { refetchOnMountOrArgChange: true });

    // States
    const [active, setActive] = useState(0);
    const [subActive, setSubActive] = useState(0);
    const [curSection, setCurSection] = useState(null);
    const [curLesson, setCurLesson] = useState(null);

    if (isGettingCourse) return <DashboardSkeleton />;

    return (
        <div>
            <CourseProgressStep course={courseResponse.course} active={active} setActive={setActive} />
            {!(active === 3 || (active === 2 && (subActive === 1 || subActive === 2))) && (
                <PublishCourseStatus course={courseResponse.course} refetchCourse={refetchCourse} />
            )}
            {active === 0 && (
                <CourseInformation
                    course={courseResponse.course}
                    active={active}
                    setActive={setActive}
                    categories={categories}
                    levels={levels}
                    refetchCourse={refetchCourse}
                />
            )}
            {active === 1 && (
                <CourseData
                    active={active}
                    setActive={setActive}
                    course={courseResponse.course}
                    refetchCourse={refetchCourse}
                />
            )}
            {active === 2 && subActive === 0 && (
                <CourseSections
                    active={active}
                    setActive={setActive}
                    subActive={subActive}
                    setSubActive={setSubActive}
                    course={courseResponse.course}
                    refetchCourse={refetchCourse}
                    setCurSection={setCurSection}
                />
            )}
            {active === 2 && subActive === 1 && (
                <EditSection
                    active={active}
                    setSubActive={setSubActive}
                    course={courseResponse.course}
                    refetchCourse={refetchCourse}
                    curSection={curSection}
                    setCurSection={setCurSection}
                    setCurLesson={setCurLesson}
                />
            )}
            {active === 2 && subActive === 2 && (
                <EditLesson
                    setSubActive={setSubActive}
                    course={courseResponse.course}
                    refetchCourse={refetchCourse}
                    curLesson={curLesson}
                    setCurLesson={setCurLesson}
                />
            )}
            {active === 3 && <CoursePreview active={active} setActive={setActive} course={courseResponse.course} />}
        </div>
    );
}

export default CreateEditCourse;
