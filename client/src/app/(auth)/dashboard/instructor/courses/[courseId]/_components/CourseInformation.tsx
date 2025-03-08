'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { ImageIcon, Pencil, PlusCircle, Upload, UploadIcon } from 'lucide-react';
import axios from 'axios';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import { Combobox } from '@/components/ui/ComboBox';
import { useUpdateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import SpinnerMini from '@/components/custom/SpinnerMini';
import VideoPlayer from './VideoPlayer';

type Props = {
    course: any;
    active: number;
    refetchCourse: any;
    setActive: (active: number) => void;
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
};

const formSchema = z.object({
    name: z.string().min(3, { message: 'Title is required and must be at least 3 characters.' }),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    description: z.string().optional(),
    levelId: z.string().optional(),
    tags: z.string().optional(),
    demoUrl: z.string().optional(),
    thumbnail: z.string().optional(),
    price: z.coerce.number().optional(),
    estimatedPrice: z.coerce.number().optional()
});

function CourseInformation({ course, active, setActive, refetchCourse, categories, levels }: Props) {
    const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState(course?.thumbnail?.url || '');
    const [videoUrl, setVideoUrl] = useState<any>(course.demoUrl || null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [updateCourse, { isLoading, isSuccess, error }] = useUpdateCourseMutation();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingLevel, setIsEditingLevel] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [isEditingSubCategory, setIsEditingSubCategory] = useState(false);
    const [isEditingThumbnail, setIsEditingThumbnail] = useState(false);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [isEditingEstimatedPrice, setIsEditingEstimatedPrice] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [isEditingVideo, setIsEditingVideo] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: course.name || '',
            categoryId: course?.category || '',
            subCategoryId: course?.subCategory || '',
            description: course?.description || '',
            levelId: course?.level || '',
            price: course?.price || undefined,
            estimatedPrice: course?.estimatedPrice || undefined,
            tags: course?.tags || ''
        }
    });

    // compute states
    const isCourseInfoValid =
        course.name &&
        course.description &&
        course.level &&
        course.category &&
        course.subCategory &&
        course.tags &&
        course.price &&
        course.thumbnail;

    const initialValues = {
        name: course.name || '',
        categoryId: course?.category || '',
        subCategoryId: course?.subCategory || '',
        description: course?.description || '',
        levelId: course?.level || '',
        tags: course?.tags || '',
        demoUrl: course?.demoUrl || '',
        price: course?.price || undefined,
        estimatedPrice: course?.estimatedPrice || undefined
    };

    // Functions
    const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagePreview(URL.createObjectURL(e.target.files[0]));

            const fileReader = new FileReader();

            fileReader.onload = () => {
                if (fileReader.readyState === 2) {
                    const image = fileReader.result;
                    setThumbnail(image);
                }
            };
            fileReader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };
    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);

        // Correctly access the file from e.dataTransfer.files
        const file = e.dataTransfer.files?.[0];

        if (file) {
            // Create a preview URL for the file
            setImagePreview(URL.createObjectURL(file));

            // Read the file as a data URL
            const reader = new FileReader();
            reader.onload = () => {
                setThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle the case where no file is dropped
            console.error('No file found in the drop event.');
        }
    };

    const resetEditingStatus = () => {
        setIsEditingName(false);
        setIsEditingLevel(false);
        setIsEditingCategory(false);
        setIsEditingDescription(false);
        setIsEditingSubCategory(false);
        setIsEditingThumbnail(false);
        setIsEditingPrice(false);
        setIsEditingEstimatedPrice(false);
        setIsEditingTags(false);
        setIsEditingVideo(false);
    };

    // Start handle upload video
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setVideoFile(event.target.files[0]);
            setVideoUrl(event.target.files[0]);
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

        if (course?.demoUrl?.public_id) {
            const deleteResponse = await deleteVideoFromCloudinary(course.demoUrl.public_id);
            if (!deleteResponse) {
                return toast({
                    variant: 'destructive',
                    title: 'Failed to delete existing video.'
                });
            }
        }

        const { timestamp, signature } = await getSignatureForUpload('demoVideos');

        const formData = new FormData();

        formData.append('file', videoFile);
        // formData.append('upload_preset', 'lessons_preset');
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUD_API_KEY || '');
        formData.append('folder', 'demoVideos');

        setIsUploading(true);
        setUploadProgress(0);

        try {
            if (course?.demoUrl?.public_id) {
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues) || thumbnail || videoFile;

        if (
            !values.name ||
            !values.categoryId ||
            !values.subCategoryId ||
            !values.levelId ||
            !values.description ||
            !imagePreview
        ) {
            return toast({
                variant: 'destructive',
                title: 'Please fill in all fields required'
            });
        }
        if (!hasChanged) {
            return toast({
                variant: 'destructive',
                title: 'No changes were made'
            });
        }

        let res;
        if (videoFile) {
            res = await videoHandler();
        }

        const data: any = {
            name: values.name,
            category: values.categoryId,
            subCategory: values.subCategoryId,
            description: values.description,
            level: values.levelId,
            price: values.price,
            estimatedPrice: values.estimatedPrice,
            tags: values.tags
        };

        if (videoFile) {
            data.demoUrl = { public_id: res.public_id, url: res.secure_url };
        }

        if (thumbnail) data.thumbnail = thumbnail;
        return updateCourse({ id: course._id, data }).unwrap();
    }

    // Effect
    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Course information update successfully'
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
    }, [isSuccess, error, isLoading, refetchCourse, active, setActive]);

    // Reset form when course data changes
    useEffect(() => {
        form.reset({
            name: course.name || '',
            categoryId: course?.category || '',
            subCategoryId: course?.subCategory || '',
            description: course?.description || '',
            levelId: course?.level || '',
            price: course?.price || undefined,
            estimatedPrice: course?.estimatedPrice || undefined,
            tags: course?.tags || '',
            demoUrl: course?.demoUrl || ''
        });
    }, [course, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* Course name */}
                    <div className="mt-4 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course name <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingName((current) => !current);
                                    if (!isEditingName) form.resetField('name');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingName ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingName && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit name
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingName && <p className="text-sm mt-2">{course.name}</p>}
                        {isEditingName && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Advanced web development"
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
                    {/* Course level */}
                    <div className="mt-4 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course level <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingLevel((current) => !current);
                                    if (!isEditingLevel) form.resetField('levelId');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingLevel ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingLevel && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit level
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingLevel && (
                            <p className={`text-sm mt-2 ${!course?.level && 'text-slate-500 italic'}`}>
                                {levels.find((level) => level.value === course.level)?.label || 'No level'}
                            </p>
                        )}
                        {isEditingLevel && (
                            <FormField
                                control={form.control}
                                name="levelId"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Combobox options={levels} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    {/* Course category */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course category <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingCategory((current) => !current);
                                    if (!isEditingCategory) form.resetField('categoryId');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingCategory ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingCategory && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit category
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingCategory && (
                            <p className={`text-sm mt-2 ${!course?.category && 'text-slate-500 italic'}`}>
                                {categories.find((category) => category.value === course.category)?.label ||
                                    'No category'}
                            </p>
                        )}
                        {isEditingCategory && (
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Combobox options={categories} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    {/* Course sub-category */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course sub-category <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingSubCategory((current) => !current);
                                    if (!isEditingSubCategory) form.resetField('subCategoryId');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingSubCategory ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingSubCategory && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit sub-category
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingSubCategory && (
                            <p className={`text-sm mt-2 ${!course?.subCategory && 'text-slate-500 italic'}`}>
                                {categories
                                    .find((category) => category.value === form.watch('categoryId'))
                                    ?.subCategories.find((subCategory) => subCategory.value === course.subCategory)
                                    ?.label || 'No Sub Category'}
                            </p>
                        )}
                        {isEditingSubCategory && (
                            <FormField
                                control={form.control}
                                name="subCategoryId"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Combobox
                                                options={
                                                    categories.find(
                                                        (category: any) => category.value === form.watch('categoryId')
                                                    )?.subCategories || []
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    {/* Course Description */}
                    <div className="border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course description <span className="text-red-600">*</span>
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
                            <p className={`text-sm mt-2 ${!course.description && 'text-slate-500 italic'}`}>
                                {course.description || 'No description'}
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
                                                placeholder="Course about..."
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
                    {/* Course tags */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course tags <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingTags((current) => !current);
                                    if (!isEditingTags) form.resetField('tags');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingTags ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingTags && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit tags
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingTags && (
                            <p className={`text-sm mt-[13px] ${!course.tags && 'text-slate-500 italic'}`}>
                                {course.tags || 'No tags'}
                            </p>
                        )}
                        {isEditingTags && (
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Javascript, HTML, CSS"
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
                    {/* Course price */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course price <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingPrice((current) => !current);
                                    if (!isEditingPrice) form.resetField('price');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingPrice ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingPrice && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit price
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingPrice && (
                            <p className={`text-sm mt-2 ${!course.price && 'text-slate-500 italic'}`}>
                                {course.price ? formatPrice(course.price) : 'No price'}
                            </p>
                        )}
                        {isEditingPrice && (
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step={0.01}
                                                placeholder="Set a price for your course"
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
                    {/* Course estimated price */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>Course estimated price</span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingEstimatedPrice((current) => !current);
                                    if (!isEditingEstimatedPrice) form.resetField('estimatedPrice');
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingEstimatedPrice ? (
                                    <span>Cancel</span>
                                ) : (
                                    !isEditingEstimatedPrice && (
                                        <>
                                            <Pencil className="h-4 w-4" />
                                            Edit estimated price
                                        </>
                                    )
                                )}
                            </Button>
                        </div>
                        {!isEditingEstimatedPrice && (
                            <p className={`text-sm mt-2 ${!course.estimatedPrice && 'text-slate-500 italic'}`}>
                                {course.estimatedPrice ? formatPrice(course.estimatedPrice) : 'No price'}
                            </p>
                        )}
                        {isEditingEstimatedPrice && (
                            <FormField
                                control={form.control}
                                name="estimatedPrice"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 mt-2">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step={0.01}
                                                placeholder="Set an estimated price for your course"
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
                    {/* Course thumbnail */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>
                                Course image <span className="text-red-600">*</span>
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    setIsEditingThumbnail((current) => !current);
                                    if (!isEditingThumbnail) {
                                        setImagePreview('');
                                    }
                                    if (thumbnail && isEditingThumbnail) setThumbnail(() => null);
                                }}
                                size={'xs'}
                                variant="ghost"
                            >
                                {isEditingThumbnail && <span>Cancel</span>}
                                {!isEditingThumbnail && !course?.thumbnail && (
                                    <>
                                        <PlusCircle className="h-4 w-4" />
                                        Add an image
                                    </>
                                )}
                                {!isEditingThumbnail && course?.thumbnail && (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Edit image
                                    </>
                                )}
                            </Button>
                        </div>
                        {!isEditingThumbnail &&
                            (!course?.thumbnail ? (
                                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                                    <ImageIcon className="h-10 w-10 text-slate-500" />
                                </div>
                            ) : (
                                <div className="relative aspect-video w-full mt-2 border-primary-100">
                                    <Image
                                        alt="Upload"
                                        fill
                                        className="object-cover rounded-md border-primary-100"
                                        src={course?.thumbnail?.url}
                                    />
                                </div>
                            ))}
                        {isEditingThumbnail && (
                            <div className="w-full mt-2">
                                <input
                                    type="file"
                                    name="thumbnail"
                                    id="thumbnail"
                                    className="hidden"
                                    onChange={imageHandler}
                                    accept="image/png,image/jpg,image/jpeg,image/webp"
                                />
                                <label
                                    htmlFor="thumbnail"
                                    className={`w-full aspect-video cursor-pointer border-primary-100 bg-slate-200 rounded border flex items-center justify-center ${dragging ? 'bg-blue-500' : 'bg-transparent'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="max-h-full w-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center flex-col gap-4">
                                            <Upload className="h-10 w-10 text-slate-500" />
                                            <span className="text-sm text-slate-500">
                                                Drag and drop your thumbnail here or click to browse
                                            </span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        )}
                    </div>
                    {/* Course demo video */}
                    <div className="mt-2 border bg-slate-100 rounded-md p-4">
                        <div className="font-medium flex items-center justify-between">
                            <span>Course demo video</span>
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
                                {!isEditingVideo && !course?.demoUrl && (
                                    <>
                                        <PlusCircle className="h-4 w-4" />
                                        Add a video
                                    </>
                                )}
                                {!isEditingVideo && course?.demoUrl && (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Edit video
                                    </>
                                )}
                            </Button>
                        </div>
                        {!isEditingVideo &&
                            (!course?.demoUrl ? (
                                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                                    <UploadIcon className="h-10 w-10 text-slate-500" />
                                </div>
                            ) : (
                                <div className="relative aspect-video w-full mt-2 border-primary-100">
                                    <VideoPlayer videoUrl={course?.demoUrl?.url || ''} />
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
            </form>
            <div className="flex justify-end mt-6">
                <Button onClick={() => onSubmit(form.getValues())} disabled={isLoading || isUploading}>
                    {(isLoading || isUploading) && <SpinnerMini />}
                    <span>Save</span>
                </Button>
                <Button
                    className="ml-3"
                    onClick={() => setActive(active + 1)}
                    disabled={isUploading || !isCourseInfoValid}
                >
                    <span>Next</span>
                </Button>
            </div>
        </Form>
    );
}

export default CourseInformation;
