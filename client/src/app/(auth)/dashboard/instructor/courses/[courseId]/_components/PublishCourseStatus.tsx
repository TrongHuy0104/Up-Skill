'use client';

import { Trash, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { toast } from '@/hooks/use-toast';
import { useDeleteCourseMutation, useUnpublishCourseMutation } from '@/lib/redux/features/course/courseApi';
import { useSelector } from 'react-redux';

type Props = { course: any; refetchCourse: any };

function PublishCourseStatus({ course, refetchCourse }: Props) {
    const router = useRouter();
    const [status, setStatus] = useState('');
    const { user } = useSelector((state: any) => state.auth);

    // Mutation + Query
    const [unpublishCourse, { isLoading: isLoadingUnPublish, isSuccess: isSuccessUnPublish, error: errorUnPublish }] =
        useUnpublishCourseMutation();
    const [deleteCourse, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, error: errorDelete }] =
        useDeleteCourseMutation();

    // Compute states
    const isCourseInfoValid =
        course.name &&
        course.description &&
        course.level &&
        course.category &&
        course.subCategory &&
        course.tags &&
        course.price &&
        course.thumbnail;

    const isCourseOptionsValid = course.benefits.length > 0 && course.prerequisites.length > 0;

    const isCourseContentValid = course.courseData.find(
        (c: any) => c.title && c.description && c.videoUrl && c.isPublished && c.isPublishedSection
    );

    // functions
    const checkIsValidCourse = () => {
        return isCourseContentValid && isCourseInfoValid && isCourseOptionsValid;
    };

    const getPublishCourseStatusMessage = () => {
        const conditions = [
            { status: isCourseInfoValid, message: 'Course Info' },
            { status: isCourseOptionsValid, message: 'Course Options' },
            { status: isCourseContentValid, message: 'Course Content' }
        ];
        return conditions.reduce((message: string, condition: { status: boolean; message: string }) => {
            if (condition.status) return message;
            return message ? `${message}, ${condition.message}` : condition.message;
        }, '');
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
            return null;
        }
    };

        const handlePublishCourse = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/request/create-request`, {
                    courseId: course._id,
                    instructorId: user._id
                },
                { withCredentials: true });
                setStatus(response?.data?.data?.status);

                toast({
                    variant: 'success',
                    title: 'Publish request sent successfully. Waiting for admin approval.'
                });

                refetchCourse();
            } catch {
                toast({
                    variant: 'destructive',
                    title: 'Failed to send publish request'
                });
            }
        };

    const handleUnPublishCourse = async () => {
        await unpublishCourse({ id: course._id }).unwrap();
    };

    const handleDeleteCourse = async () => {
        const errors = [];

        // Delete demo video if it exists
        if (course?.demoUrl?.public_id) {
            const deleteResponse = await deleteVideoFromCloudinary(course.demoUrl.public_id);
            if (!deleteResponse) {
                errors.push('Failed to delete existing demo video.');
            }
        }

        // Create an array to hold the promises for section video deletions
        const deleteSectionPromises = course.courseData.map((section: any) => {
            if (section?.videoUrl?.public_id) {
                return deleteVideoFromCloudinary(section.videoUrl.public_id).then((deleteResponse) => {
                    if (!deleteResponse) {
                        errors.push(`Failed to delete video for section: ${section.title || 'Unnamed section'}.`);
                    }
                });
            }
            return Promise.resolve(); // Return a resolved promise for sections without a video
        });

        // Wait for all delete promises to complete
        await Promise.all(deleteSectionPromises);

        // Handle any errors encountered during deletion
        if (errors.length > 0) {
            errors.forEach((error) => {
                toast({
                    variant: 'destructive',
                    title: error
                });
            });
        }

        // Finally, delete the course
        await deleteCourse(course._id);
    };
    const fetchRequestStatus = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/request/get-request/${course._id}`,
                { withCredentials: true });
            setStatus(response.data?.data?.status || '');
        } catch (error) {
            console.error('Error fetching request status:', error);
        }
    };
    useEffect(() => {
        if (course?._id) {
            fetchRequestStatus();
        }
    }, [course?._id]);
    

    useEffect(() => {
        if (isSuccessUnPublish) {
            toast({
                variant: 'success',
                title: 'Course unpublish successfully'
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
                title: 'Delete course successfully'
            });
            refetchCourse();
            router.replace('/dashboard/instructor');
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
    }, [isSuccessDelete, errorDelete, isLoadingDelete, refetchCourse, router]);

    return (
        <div className="grid grid-cols-1 mt-2">
            <div
                className={`border rounded-md p-4 ${!checkIsValidCourse() ? 'bg-yellow-100 border-yellow-300' : 'bg-green-100 border-green-300'} `}
            >
                {!checkIsValidCourse() && (
                    <div className="flex gap-2 italic text-slate-600 mb-2">
                        <TriangleAlert className="w-5" /> This course is unpublished. It will not be visited by any
                        students.
                    </div>
                )}
                <div className="flex justify-between items-center">
                    {status === 'pending' ? (
                        <p className="text-yellow-600">Your request has been sent. Please wait for admin approval.</p>
                    ) : checkIsValidCourse() ? (
                        <p>Your course is available to publish</p>
                    ) : (
                        <p>
                            Your course is missing some required fields in{' '}
                            <strong>{getPublishCourseStatusMessage()}</strong> part
                        </p>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={() => (course.isPublished ? handleUnPublishCourse() : handlePublishCourse())}
                            className="px-4 py-2 text-sm"
                            disabled={status === 'pending' || isLoadingUnPublish}
                        >
                            {status === 'pending' && course?.isPublished === false ? 'Pending' : course.isPublished ? 'Unpublish' : 'Publish'}
                        </Button>
                        ;
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
                                        Are you sure to delete this course?
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
                                                onClick={handleDeleteCourse}
                                            >
                                                {isLoadingDelete && <SpinnerMini />}
                                                Delete
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
    );
}

export default PublishCourseStatus;
