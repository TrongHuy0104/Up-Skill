'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import { useCreateSectionMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';
import CourseSectionsList from './CourseSectionsList';

type Props = {
    setCurSection: any;
    active: number;
    subActive: number;
    course: any;
    refetchCourse: any;
    setActive: (active: number) => void;
    setSubActive: (active: number) => void;
};

const formSchema = z.object({
    title: z.string().min(1, { message: 'Section title has to be filled.' })
});

function CourseSections({ active, setActive, setSubActive, course, refetchCourse, setCurSection }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    });
    const [isEditingSection, setIsEditingSection] = useState(false);

    const [createSection, { isLoading, isSuccess, error }] = useCreateSectionMutation();

    const { isSubmitting, isValid } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (course.courseData.map((item: any) => item.videoSection).includes(values.title))
            return toast({
                variant: 'destructive',
                title: 'Course section title is exist'
            });
        await createSection({ title: values.title, id: course._id });
    }

    const prevButton = () => {
        setActive(1);
    };

    const checkIsValidLesson = () => {
        return course.courseData.find((c: any) => c.title && c.description && c.videoUrl);
    };

    const handleNext = () => {
        if (course?.courseData.length === 0) {
            return toast({
                variant: 'destructive',
                title: 'Course must have at least one lesson with full necessary information'
            });
        } else if (!checkIsValidLesson()) {
            return toast({
                variant: 'destructive',
                title: 'Course must have at least one lesson with full necessary information',
                description: 'You can go to edit the course to fill in the necessary information'
            });
        }
        setActive(active + 1);
    };

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Create section successfully'
            });
            refetchCourse();
            setIsEditingSection(false);
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
    }, [isSuccess, error, isLoading, refetchCourse, active, setActive]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 mt-8 relative">
                        <div className="border bg-slate-100 rounded-md p-4">
                            <div className="font-medium flex items-center justify-between">
                                <span>
                                    Course sections <span className="text-red-600">*</span>
                                </span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent form submission
                                        setIsEditingSection((current) => !current);
                                        if (!isEditingSection) form.resetField('title');
                                    }}
                                    size={'xs'}
                                    variant="ghost"
                                >
                                    {isEditingSection ? (
                                        <span>Cancel</span>
                                    ) : (
                                        !isEditingSection && (
                                            <>
                                                <PlusCircle className="h-4 w-4" />
                                                Add section
                                            </>
                                        )
                                    )}
                                </Button>
                            </div>
                            {!isEditingSection && (
                                <div
                                    className={`text-sm mt-2 ${course.courseData.length === 0 && 'text-slate-500 italic'}`}
                                >
                                    {course.courseData.length !== 0 ? (
                                        <div>
                                            <CourseSectionsList
                                                setSubActive={setSubActive}
                                                onEdit={setCurSection}
                                                courseId={course?._id}
                                                sections={course.courseData}
                                                refetchCourse={refetchCourse}
                                            />
                                        </div>
                                    ) : (
                                        'No course section'
                                    )}
                                </div>
                            )}

                            {isEditingSection && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4 mt-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Section name..."
                                                        {...field}
                                                        className="bg-primary-50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            size="sm"
                                            type="submit"
                                            disabled={!isValid || isSubmitting || isLoading}
                                        >
                                            {isLoading && <SpinnerMini />}
                                            <span>Save</span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </Form>

            <div className="flex justify-between mt-8">
                <Button onClick={prevButton}>
                    <span>Back</span>
                </Button>
                <Button onClick={handleNext}>
                    <span>Next</span>
                </Button>
            </div>
        </>
    );
}

export default CourseSections;
