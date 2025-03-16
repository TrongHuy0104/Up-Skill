import React, { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import Link from 'next/link';
import { CirclePlus, CircleX, Pencil, PlusCircle, Trash, TriangleAlert, Upload, UploadIcon } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import {
    useDeleteLessonMutation,
    usePublishLessonMutation,
    useUnpublishLessonMutation,
    useUpdateLessonMutation
} from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import VideoPlayer from './VideoPlayer';
import { formCreateCourseStyles } from '@/styles/styles';

type Props = {
    curLesson?: any;
    setCurLesson?: any;
    setSubActive: (active: number) => void;
    course: any;
    refetchCourse: any;
};

const formSchema = z.object({
    title: z.string().min(1, { message: 'Lesson title has to be filled.' }),
    description: z.string().optional(),
    isFree: z.boolean().optional()
});

function EditLesson({ setSubActive, course, refetchCourse, curLesson }: Props) {
    const [updateLesson, { isLoading, isSuccess, error }] = useUpdateLessonMutation();
    const [deleteLesson, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, error: errorDelete }] =
        useDeleteLessonMutation();
    const [publishLesson, { isLoading: isLoadingPublish, isSuccess: isSuccessPublish, error: errorPublish }] =
        usePublishLessonMutation();
    const [unpublishLesson, { isLoading: isLoadingUnPublish, isSuccess: isSuccessUnPublish, error: errorUnPublish }] =
        useUnpublishLessonMutation();

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<any>(
        course.courseData.find((c: any) => c._id === curLesson)?.videoUrl || null
    );
    const [isUploading, setIsUploading] = useState(false);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingFree, setIsEditingFree] = useState(false);
    const [isEditingVideo, setIsEditingVideo] = useState(false);
    const [isEditingLinks, setIsEditingLinks] = useState(false);

    const currentLesson = course.courseData.find((c: any) => c._id === curLesson);

    const requiredField = [currentLesson?.title, currentLesson?.description, currentLesson?.videoUrl];

    const completedField = requiredField.filter((i: any) => i !== undefined && i !== null);

    const checkLessonAvailable = requiredField.every(Boolean);

    const [links, setLinks] = useState(
        currentLesson.links.length === 0 ? [{ title: '', url: '' }] : currentLesson.links
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: currentLesson?.title || '',
            description: currentLesson?.description || '',
            isFree: currentLesson?.isFree || false
        }
    });

    const resetEditingStatus = () => {
        setIsEditingTitle(false);
        setIsEditingDescription(false);
        setIsEditingFree(false);
        setIsEditingVideo(false);
        setIsEditingLinks(false);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!values.title || !values.description || !videoUrl) {
            return toast({
                variant: 'destructive',
                title: 'Please fill in all fields required'
            });
        }

        let res;
        if (videoFile) {
            res = await videoHandler();
        }

        const data: any = {
            id: curLesson,
            title: values.title,
            description: values.description,
            isFree: values.isFree
        };

        if (videoFile) {
            data.videoUrl = { public_id: res.public_id, url: res.secure_url };
            data.duration = res.duration;
        }

        if (links.length > 0 && links[0].title && links[0].url) {
            const filterLinks = links.filter((link: any) => link.title !== '' && link.url !== '');
            data.links = filterLinks;
        }

        if (course.courseData.find((c: any) => c.title && c.description && c.videoUrl)) data.isPublished = true;

        updateLesson({ id: course._id, data }).unwrap();
    }

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
            setVideoFile(null);
            console.error('Error deleting video:', error);
            return null; // Return null if there's an error
        }
    };

    const getSignatureForDelete = async (publicId: string) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/sign-delete`, { publicId });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getSignatureForUpload = async (folder: string) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/sign-upload`, { folder });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const videoHandler = async () => {
        if (!videoFile) return;

        if (currentLesson?.videoUrl?.public_id) {
            const deleteResponse = await deleteVideoFromCloudinary(currentLesson.videoUrl.public_id);
            if (!deleteResponse) {
                return toast({
                    variant: 'destructive',
                    title: 'Failed to delete existing video.'
                });
            }
        }

        const { timestamp, signature } = await getSignatureForUpload('lessons');

        const formData = new FormData();

        formData.append('file', videoFile);
        // formData.append('upload_preset', 'lessons_preset');
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUD_API_KEY || '');
        formData.append('folder', 'lessons');

        setIsUploading(true);
        setUploadProgress(0);

        try {
            if (currentLesson?.videoUrl?.public_id) {
            }
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/upload`, // Replace with your cloud name
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        if (total) {
                            const percent = Math.floor((loaded * 100) / total);
                            setUploadProgress(percent);
                        }
                    }
                }
            );

            setVideoUrl({ public_id: response.data.public_id, url: response.data.secure_url }); // Store the video URL
            toast({
                variant: 'success',
                title: 'Upload successful!'
            });
            setVideoFile(null);
            return response.data;
        } catch (error) {
            console.error('Error uploading video:', error);
            toast({
                variant: 'destructive',
                title: 'Upload failed.'
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleLinkTitleChange = (index: number, value: string) => {
        const updateLinks = [...links];
        updateLinks[index].title = value;
        setLinks(updateLinks);
    };

    const handleLinkUrlChange = (index: number, value: string) => {
        const updateLinks = [...links];
        updateLinks[index].url = value;
        setLinks(updateLinks);
    };

    const handleAddLink = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (links.find((link: any) => link.title === '' || link.url === '')) {
            toast({
                variant: 'destructive',
                title: 'Please fill the empty link!'
            });
        } else {
            setLinks([...links, { title: '', url: '' }]);
        }
    };

    const handleRemoveLink = (index: number) => {
        const filterLinks = links.filter((link: any, i: number) => i !== index);
        if (filterLinks.length === 0) {
            return;
        } else {
            setLinks(filterLinks);
        }
    };

    const handleDeleteLesson = async () => {
        const data: any = {
            id: curLesson
        };

        if (currentLesson?.videoUrl?.public_id) {
            const deleteResponse = await deleteVideoFromCloudinary(currentLesson.videoUrl.public_id);
            if (!deleteResponse) {
                return toast({
                    variant: 'destructive',
                    title: 'Failed to delete existing video.'
                });
            }
        }

        await deleteLesson({ id: course._id, data }).unwrap();
    };

    const handlePublishLesson = async () => {
        const data: any = {
            id: curLesson,
            isPublished: true
        };

        await publishLesson({ id: course._id, data }).unwrap();
    };

    const handleUnPublishLesson = async () => {
        const data: any = {
            id: curLesson,
            isPublished: false
        };

        await unpublishLesson({ id: course._id, data }).unwrap();
    };

    const prevButton = () => {
        setSubActive(1);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setVideoFile(event.target.files[0]);
            setVideoUrl(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Lesson information update successfully'
            });
            refetchCourse();
            resetEditingStatus();
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

    useEffect(() => {
        if (isSuccessDelete) {
            toast({
                variant: 'success',
                title: 'Lesson delete successfully'
            });
            refetchCourse();
            setSubActive(1);
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

    useEffect(() => {
        if (isSuccessPublish) {
            toast({
                variant: 'success',
                title: 'Lesson publish successfully'
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
                title: 'Lesson unpublish successfully'
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

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 mt-2 gap-6">
                        <div className="border bg-slate-100 rounded-md p-4">
                            {!checkLessonAvailable && (
                                <div className="flex gap-2 italic text-slate-600 mb-2">
                                    <TriangleAlert className="w-5" /> This lesson is unpublished. It will not be visited
                                    in the course.
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <p>
                                    Complete all fields ({completedField.length}/{requiredField.length}){' '}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() =>
                                            currentLesson.isPublished ? handleUnPublishLesson() : handlePublishLesson()
                                        }
                                        className="px-4 py-2 text-sm"
                                        disabled={!checkLessonAvailable || isLoadingPublish || isLoadingUnPublish}
                                    >
                                        {currentLesson.isPublished ? 'Unpublish' : 'Publish'}
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
                                                    Are you sure to delete this lesson?
                                                </DialogTitle>
                                                <div className="flex gap-2 items-center justify-end">
                                                    <DialogClose asChild>
                                                        <Button type="button" className="px-4 py-2" variant="outline">
                                                            Close
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button className="px-4 py-2" onClick={handleDeleteLesson}>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-6">
                        <div>
                            {/* Lesson title */}
                            <div className="mt-2 border bg-slate-100 rounded-md p-4">
                                <div className="font-medium flex items-center justify-between">
                                    <span>
                                        Lesson title <span className="text-red-600">*</span>
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
                                {!isEditingTitle && <p className="text-sm mt-2">{currentLesson?.title}</p>}
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
                                            <span>Save</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {/* Course is free */}
                            <div className="mt-4 border bg-slate-100 rounded-md p-4">
                                <div className="font-medium flex items-center justify-between">
                                    <span>Course access</span>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent form submission
                                            setIsEditingFree((current) => !current);
                                            if (!isEditingFree) form.resetField('isFree');
                                        }}
                                        size={'xs'}
                                        variant="ghost"
                                    >
                                        {isEditingFree ? (
                                            <span>Cancel</span>
                                        ) : (
                                            !isEditingFree && (
                                                <>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit access
                                                </>
                                            )
                                        )}
                                    </Button>
                                </div>
                                {!isEditingFree && (
                                    <p className={`text-sm mt-2 ${!currentLesson.isFree && 'text-slate-500 italic'}`}>
                                        {currentLesson.isFree
                                            ? 'Current lesson is free to watch'
                                            : 'Current lesson is not free to watch'}
                                    </p>
                                )}
                                {isEditingFree && (
                                    <FormField
                                        control={form.control}
                                        name="isFree"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormDescription>
                                                        Check this box if you want to make this chapter free for preview
                                                    </FormDescription>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            {/* Lesson Description */}
                            <div className="border mt-4 bg-slate-100 rounded-md p-4">
                                <div className="font-medium flex items-center justify-between">
                                    <span>
                                        Lesson description <span className="text-red-600">*</span>
                                    </span>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent form submission
                                            setIsEditingDescription((current) => !current);
                                            if (!isEditingDescription) form.resetField('description');
                                        }}
                                        size={'xs'}
                                        variant="ghost"
                                    >
                                        {isEditingDescription ? (
                                            <span>Cancel</span>
                                        ) : (
                                            !isEditingDescription && (
                                                <>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit description
                                                </>
                                            )
                                        )}
                                    </Button>
                                </div>
                                {!isEditingDescription && (
                                    <p
                                        className={`text-sm mt-2 ${!currentLesson?.description && 'text-slate-500 italic'}`}
                                    >
                                        {currentLesson.description || 'No description'}
                                    </p>
                                )}
                                {isEditingDescription && (
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4 mt-2">
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Lesson about..."
                                                        {...field}
                                                        className="bg-primary-50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Lesson video */}
                        <div className="mt-2 border bg-slate-100 rounded-md p-4">
                            <div className="font-medium flex items-center justify-between">
                                <span>
                                    Lesson video <span className="text-red-600">*</span>
                                </span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent form submission
                                        setIsEditingVideo((current) => !current);
                                        if (videoUrl && isEditingVideo) setVideoFile(() => null);
                                    }}
                                    size={'xs'}
                                    variant="ghost"
                                >
                                    {isEditingVideo && <span>Cancel</span>}
                                    {!isEditingVideo && !currentLesson?.videoUrl && (
                                        <>
                                            <PlusCircle className="h-4 w-4" />
                                            Add a video
                                        </>
                                    )}
                                    {!isEditingVideo && currentLesson?.videoUrl && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit video
                                        </>
                                    )}
                                </Button>
                            </div>
                            {!isEditingVideo &&
                                (!currentLesson?.videoUrl ? (
                                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                                        <UploadIcon className="h-10 w-10 text-slate-500" />
                                    </div>
                                ) : (
                                    <div className="relative aspect-video w-full mt-2 border-primary-100">
                                        <VideoPlayer videoUrl={videoUrl?.url || ''} />
                                    </div>
                                ))}
                            {isEditingVideo && (
                                <div className="w-full mt-2">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        name="video"
                                        id="video"
                                        hidden
                                        onChange={handleChange}
                                    />

                                    <label
                                        htmlFor="video"
                                        className={`w-full aspect-video cursor-pointer border-primary-100 bg-slate-200 rounded border flex items-center justify-center`}
                                    >
                                        <div className="flex items-center justify-center flex-col gap-4">
                                            <Upload className="h-10 w-10 text-slate-500" />
                                            <span className="text-sm text-slate-500">
                                                {videoFile ? videoFile.name.toString() : 'Click to upload your video'}
                                            </span>
                                            {isUploading && (
                                                <>
                                                    <Button
                                                        size={'default'}
                                                        variant={'primary'}
                                                        className="bg-primary-800"
                                                    >{`Uploading... ${uploadProgress}%`}</Button>
                                                    <progress className="rounded" value={uploadProgress} max="100" />
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Lesson links */}
                    <div className="grid grid-cols-1 mt-2 relative">
                        <div className="border bg-slate-100 rounded-md p-4">
                            <div className="font-medium flex items-center justify-between">
                                <span>Lesson attachment links</span>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent form submission
                                        setIsEditingLinks((current) => !current);
                                    }}
                                    size={'xs'}
                                    variant="ghost"
                                >
                                    {isEditingLinks ? (
                                        <span>Cancel</span>
                                    ) : (
                                        !isEditingLinks && (
                                            <>
                                                <Pencil className="h-4 w-4" />
                                                Edit links
                                            </>
                                        )
                                    )}
                                </Button>
                            </div>
                            {!isEditingLinks && (
                                <div className={`text-sm mt-2 ${links.length === 0 && 'text-slate-500 italic'}`}>
                                    {currentLesson.links.length !== 0 ? (
                                        <div>
                                            {links.map((link: any) => (
                                                <p
                                                    className="bg-primary-50 mt-3 w-full p-2 border border-primary-100 rounded-md"
                                                    key={link.title + link.url}
                                                >
                                                    {link.title}:{' '}
                                                    <Link href={link.url} className="text-blue-600">
                                                        {link.url}
                                                    </Link>
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        'No attachment links'
                                    )}
                                </div>
                            )}
                            {isEditingLinks && (
                                <div>
                                    {links.map((link: any, index: number) => (
                                        <div
                                            className="relative border border-primary-100 p-4 rounded-md mt-4"
                                            key={`${index}`}
                                        >
                                            <div className="w-[100%] flex flex-col gap-2">
                                                <input
                                                    className={`${formCreateCourseStyles.input} pr-8`}
                                                    type="text"
                                                    value={link.title}
                                                    onChange={(e) => handleLinkTitleChange(index, e.target.value)}
                                                    placeholder="Enter link title..."
                                                ></input>
                                                <input
                                                    className={`${formCreateCourseStyles.input} pr-8`}
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => handleLinkUrlChange(index, e.target.value)}
                                                    placeholder="Enter link url..."
                                                ></input>
                                            </div>
                                            <CircleX
                                                onClick={() => handleRemoveLink(index)}
                                                className="absolute top-0 right-[-10px] -translate-y-1/2 w-6 text-slate-600 cursor-pointer hover:text-accent-900 transition-colors"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        size="rounded"
                                        className="mt-[10px] cursor-pointer w-[30px] py-3 px-5"
                                        onClick={(e) => handleAddLink(e)}
                                    >
                                        <CirclePlus />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button size="sm" onClick={prevButton} disabled={isUploading}>
                            <span>Back</span>
                        </Button>
                        <Button type="submit" className="ml-auto" disabled={isLoading || isUploading}>
                            {(isLoading || isUploading) && <SpinnerMini />}
                            <span>Save</span>
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default EditLesson;
