'use client';

import { useEffect, useState } from 'react';

import CourseProgressStep from './CourseProgressStep';
import CourseInformation from './CourseInformation';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useCreateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

interface CreateCourseProps {
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

function CreateCourse({ categories, levels }: CreateCourseProps) {
    const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();
    const [active, setActive] = useState(-1);
    const [courseData, setCourseData] = useState({});
    const [courseInfo, setCourseInfo] = useState({
        name: '',
        category: '',
        subCategory: '',
        description: '',
        level: '',
        price: undefined,
        estimatedPrice: undefined,
        tags: '',
        demoUrl: '',
        thumbnail: ''
    });
    const [benefits, setBenefits] = useState([{ title: '' }]);
    const [prerequisites, setPrerequisites] = useState([{ title: '' }]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: '',
            title: '',
            description: '',
            videoSection: 'Untitled Section',
            links: [
                {
                    title: '',
                    url: ''
                }
            ],
            suggestion: ''
        }
    ]);
    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Course created successfully'
            });
            setActive(active + 1);
            redirect('dashboard/instructor/courses');
        }
        if (error) {
            if ('data' in error) {
                const errorData = error as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isSuccess, error, isLoading, active]);
    const prepareCourseData = () => {
        // Format benefits
        const formatBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        // Format prerequisites
        const formatPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));
        // Format course content
        const formatCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({ title: link.title, url: link.url })),
            suggestion: courseContent.suggestion
        }));
        // Prepare data object
        return {
            name: courseInfo.name,
            description: courseInfo.description,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            thumbnail: courseInfo.thumbnail,
            category: courseInfo.category,
            subCategory: courseInfo.subCategory,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            totalVideos: courseContentData.length,
            benefits: formatBenefits,
            prerequisites: formatPrerequisites,
            courseData: formatCourseContentData
        };
    };

    const handleSubmit = async () => {
        const data = prepareCourseData();
        setCourseData(data); // Update state (optional, if you still need it for other purposes)
        return data; // Return the prepared data
    };

    const handleCourseCreate = async () => {
        const data = await handleSubmit();
        // Get the latest data directly
        if (Object.keys(data).length === 0) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Course data is empty.'
            });
            return;
        }

        await createCourse(data); // Use the latest data
    };

    return (
        <div>
            <CourseProgressStep active={active} setActive={setActive} />
            {active === -1 && (
                <CourseInformation
                    courseInfo={courseInfo}
                    setCourseInfo={setCourseInfo}
                    active={active}
                    setActive={setActive}
                    categories={categories}
                    levels={levels}
                />
            )}
            {active === 0 && (
                <CourseData
                    active={active}
                    setActive={setActive}
                    benefits={benefits}
                    setBenefits={setBenefits}
                    prerequisites={prerequisites}
                    setPrerequisites={setPrerequisites}
                />
            )}
            {active === 1 && (
                <CourseContent
                    active={active}
                    setActive={setActive}
                    courseContentData={courseContentData}
                    setCourseContentData={setCourseContentData}
                    handleSubmit={handleSubmit}
                />
            )}
            {active === 2 && (
                <CoursePreview
                    active={active}
                    setActive={setActive}
                    courseData={courseData}
                    handleCourseCreate={handleCourseCreate}
                />
            )}
        </div>
    );
}

export default CreateCourse;
