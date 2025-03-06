import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Pencil, Trash, TriangleAlert } from 'lucide-react';
import axios from 'axios';

import CreateLesson from './CreateLesson';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import {
    useDeleteSectionMutation,
    usePublishSectionMutation,
    useUnpublishSectionMutation,
    useUpdateSectionMutation
} from '@/lib/redux/features/course/courseApi';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';

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
    title: z.string().min(1, { message: 'Section title has to be filled.' }),
    lessonTitle: z.string().min(1, { message: 'Lesson title has to be filled.' })
});

function EditSection({ active, setSubActive, course, refetchCourse, curSection, setCurSection, setCurLesson }: Props) {
    // Redux Mutations
    const [
        updateSection,
        { isLoading: isLoadingUpdateSection, isSuccess: isUpdateSectionSuccess, error: updateSectionError }
    ] = useUpdateSectionMutation();
    const [publishSection, { isLoading: isLoadingPublish, isSuccess: isSuccessPublish, error: errorPublish }] =
        usePublishSectionMutation();
    const [unpublishSection, { isLoading: isLoadingUnPublish, isSuccess: isSuccessUnPublish, error: errorUnPublish }] =
        useUnpublishSectionMutation();
    const [deleteSection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, error: errorDelete }] =
        useDeleteSectionMutation();
    //

    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const currentSections = course.courseData.filter((c: any) => c.videoSection === curSection);

    let currentSection: any;
    if (currentSections.length) currentSection = currentSections[0];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            lessonTitle: currentSection?.title || ''
        }
    });

    // Functions
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (course.courseData.map((item: any) => item.videoSection).includes(values.title))
            return toast({
                variant: 'destructive',
                title: 'Course section title is exist'
            });
        setCurSection(values.title);
        await updateSection({ title: values.title, oldTitle: curSection, id: course._id });
    }

    const prevButton = () => {
        setSubActive(0);
    };

    const checkIsValidLesson = () => {
        return currentSections.find((c: any) => c.title && c.description && c.videoUrl && c.isPublished);
    };

    const handlePublishSection = async () => {
        const data: any = {
            videoSection: curSection,
            isPublished: true
        };

        await publishSection({ id: course._id, data }).unwrap();
    };

    const handleUnPublishSection = async () => {
        const data: any = {
            videoSection: curSection,
            isPublished: false
        };

        await unpublishSection({ id: course._id, data }).unwrap();
    };

    const getSignatureForDelete = async (publicId: string) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/sign-delete`, { publicId });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteVideoFromCloudinary = async (publicId: string) => {
        try {
            const { signature, timestamp } = await getSignatureForDelete(publicId); // Get the signature for deletion

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/destroy`, // Replace with your cloud name
                {
                    public_id: publicId,
                    api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
                    signature,
                    timestamp
                }
            );

            return response.data; // Return the response data
        } catch (error) {
            console.error('Error deleting video:', error);
            return null; // Return null if there's an error
        }
    };

    const handleDeleteSection = async () => {
        const data: any = {
            videoSection: curSection
        };

        // Create an array to hold the promises
        const deletePromises = currentSections.map(async (section: any) => {
            if (section?.videoUrl?.public_id) {
                const deleteResponse = await deleteVideoFromCloudinary(section.videoUrl.public_id);
                if (!deleteResponse) {
                    toast({
                        variant: 'destructive',
                        title: 'Failed to delete existing video.'
                    });
                }
            }
        });

        // Wait for all delete promises to complete
        await Promise.all(deletePromises);

        await deleteSection({ id: course._id, data }).unwrap();
    };

    // Effect
    useEffect(() => {
        if (isUpdateSectionSuccess) {
            toast({
                variant: 'success',
                title: 'Update section successfully'
            });
            refetchCourse();
            setIsEditingTitle(false);
        }
        if (updateSectionError) {
            if ('data' in updateSectionError) {
                const errorData = updateSectionError as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isUpdateSectionSuccess, updateSectionError, isLoadingUpdateSection, refetchCourse]);

    useEffect(() => {
        if (isSuccessPublish) {
            toast({
                variant: 'success',
                title: 'Section publish successfully'
            });
            refetchCourse();
        }
        if (errorPublish) {
            if ('data' in errorPublish) {
                const errorData = errorPublish as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isSuccessPublish, errorPublish, isLoadingPublish, refetchCourse]);

    useEffect(() => {
        if (isSuccessUnPublish) {
            toast({
                variant: 'success',
                title: 'Section unpublish successfully'
            });
            refetchCourse();
        }
        if (errorUnPublish) {
            if ('data' in errorUnPublish) {
                const errorData = errorUnPublish as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isSuccessUnPublish, errorUnPublish, isLoadingUnPublish, refetchCourse]);

    useEffect(() => {
        if (isSuccessDelete) {
            toast({
                variant: 'success',
                title: 'Section delete successfully'
            });
            refetchCourse();
            setSubActive(0);
        }
        if (errorDelete) {
            if ('data' in errorDelete) {
                const errorData = errorDelete as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isSuccessDelete, errorDelete, isLoadingDelete, setSubActive, refetchCourse]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 mt-2">
                        <div className="border bg-slate-100 rounded-md p-4">
                            {!checkIsValidLesson() && (
                                <div className="flex gap-2 italic text-slate-600 mb-2">
                                    <TriangleAlert className="w-5" /> This section is unpublished. It will not be
                                    visited in the course.
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <p>Section valid need at least one lesson valid and published</p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() =>
                                            currentSection.isPublishedSection
                                                ? handleUnPublishSection()
                                                : handlePublishSection()
                                        }
                                        className="px-4 py-2 text-sm"
                                        disabled={!checkIsValidLesson() || isLoadingPublish || isLoadingUnPublish}
                                    >
                                        {currentSection.isPublishedSection ? 'Unpublish' : 'Publish'}
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger
                                            disabled={isLoadingDelete}
                                            className="px-3 py-2 bg-primary-800 text-primary-50 shadow hover:bg-accent-900 rounded"
                                        >
                                            <Trash className="w-5" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-primary-800 mb-6">
                                                    Are you sure to delete this section?
                                                </DialogTitle>
                                                <div className="flex gap-2 items-center justify-end">
                                                    <DialogClose asChild>
                                                        <Button type="button" className="px-4 py-2" variant="outline">
                                                            Close
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="px-4 py-2"
                                                            disabled={isLoadingDelete}
                                                            onClick={handleDeleteSection}
                                                        >
                                                            {isLoadingDelete && <SpinnerMini />}Delete
                                                        </Button>
                                                    </DialogClose>
                                                </div>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        {/* Section title */}
                        <div className=" border bg-slate-100 rounded-md p-4">
                            <div className="font-medium flex items-center justify-between">
                                <span>
                                    Section title <span className="text-red-600">*</span>
                                </span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent form submission
                                        setIsEditingTitle((current) => !current);
                                        if (!isEditingTitle) form.resetField('title');
                                    }}
                                    size={'xs'}
                                    variant="ghost"
                                >
                                    {isEditingTitle ? (
                                        <span>Cancel</span>
                                    ) : (
                                        !isEditingTitle && (
                                            <>
                                                <Pencil className="h-4 w-4" />
                                                Edit title
                                            </>
                                        )
                                    )}
                                </Button>
                            </div>
                            {!isEditingTitle && <p className="text-sm mt-2">{curSection}</p>}
                            {isEditingTitle && (
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4 mt-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Course section..."
                                                    {...field}
                                                    className="bg-primary-50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {isEditingTitle && (
                                <div className="mt-4 flex justify-end">
                                    <Button size="sm" className="ml-auto px-4 py-2" type="submit">
                                        {/* {isLoading && <SpinnerMini />} */}
                                        <span>Save</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
            {/* Section lesson */}
            <CreateLesson
                curSection={curSection}
                setCurSection={setCurSection}
                active={active}
                setSubActive={setSubActive}
                course={course}
                refetchCourse={refetchCourse}
                setCurLesson={setCurLesson}
            />
            <div className="flex justify-start mt-6">
                <Button size="sm" onClick={prevButton}>
                    <span>Back</span>
                </Button>
            </div>
        </>
    );
}

export default EditSection;
