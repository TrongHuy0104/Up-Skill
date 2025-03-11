import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import { useAddLessonMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import CourseLessonsList from './CourseLessonsList';

type Props = {
    curSection?: any;
    setCurSection?: any;
    setCurLesson: any;
    active: number;
    setSubActive: (active: number) => void;
    course: any;
    refetchCourse: any;
};

const formSchema = z.object({
    lessonTitle: z.string().min(1, { message: 'Lesson title has to be filled.' })
});

function CreateLesson({ setSubActive, course, refetchCourse, curSection, setCurLesson }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lessonTitle: ''
        }
    });

    const [addLesson, { isLoading, isSuccess, error }] = useAddLessonMutation();

    const [isCreatingLesson, setIsCreatingLesson] = useState(false);

    const currentSections = course.courseData.filter((c: any) => c.videoSection === curSection);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await addLesson({ title: values.lessonTitle, videoSection: curSection, id: course._id });
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Create lesson successfully'
            });
            refetchCourse();
            setIsCreatingLesson(false);
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
    }, [isSuccess, error, isLoading, refetchCourse]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 mt-2 relative">
                    {/* Section lesson */}
                    <div className="border bg-slate-100 rounded-md mt-4 p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Section lessons <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsCreatingLesson((current) => !current);
                                    if (!isCreatingLesson) form.resetField('lessonTitle');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isCreatingLesson ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isCreatingLesson && (
                                        <>
                                            <PlusCircle className="h-4 w-4" />
                                            Add lesson
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isCreatingLesson && (
                            <div className={`text-sm mt-2 ${currentSections[0]?.title && 'text-slate-500 italic'}`}>
                                {currentSections[0]?.title ? (
                                    <div>
                                        <CourseLessonsList
                                            setSubActive={setSubActive}
                                            onEdit={setCurLesson}
                                            course={course}
                                            curSection={curSection}
                                            refetchCourse={refetchCourse}
                                        />
                                    </div>
                                ) : (
                                    'No course section'
                                )}
                            </div>
                        )}

                        {isCreatingLesson && (
                            <FormField
                                control={form.control}
                                name="lessonTitle"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Input placeholder="Lesson title..." {...field} className="bg-primary-50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {isCreatingLesson && (
                            <div className="mt-4 flex justify-end">
                                <Button size="sm" className="ml-auto px-4 py-2" type="submit">
                                    <span>Save</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
}

export default CreateLesson;
