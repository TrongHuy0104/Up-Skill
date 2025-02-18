'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/common/Input';
import { Combobox } from '@/components/ui/ComboBox';
import { formCreateCourseStyles } from '@/styles/styles';

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
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
    categoryId: z.string().min(1, { message: 'Category is required' }),
    subCategoryId: z.string().min(1, { message: 'Sub Category is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    levelId: z.string().min(1, { message: 'Level is required' }),
    tags: z.string().optional(),
    demoUrl: z.string().min(1, { message: 'Demo URL is required' }),
    thumbnail: z.string().optional(),
    price: z.coerce.number().min(0.01, { message: 'Price is required and must be a valid number greater than 0' }),
    estimatedPrice: z.coerce.number().optional()
});

function CourseInformation({ courseInfo, setCourseInfo, active, setActive, categories, levels }: Props) {
    const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState(courseInfo.thumbnail || '');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: courseInfo.name || '',
            categoryId: courseInfo.category || '',
            subCategoryId: courseInfo.subCategory || '',
            description: courseInfo.description || '',
            levelId: courseInfo.level || '',
            price: courseInfo.price || undefined,
            estimatedPrice: courseInfo.estimatedPrice || undefined,
            tags: courseInfo.tags || '',
            demoUrl: courseInfo.demoUrl || ''
        }
    });

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setActive(active + 1);

        setCourseInfo({
            name: values.name,
            category: values.categoryId,
            subCategory: values.subCategoryId,
            description: values.description,
            level: values.levelId,
            price: values.price,
            estimatedPrice: values.estimatedPrice,
            tags: values.tags,
            demoUrl: values.demoUrl,
            thumbnail: thumbnail
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course name</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <textarea
                                    rows={6}
                                    cols={30}
                                    className={`${formCreateCourseStyles.input} h-auto`}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                />
                                {/* <RichTextEditor description={field.value} onChange={(value) => field.onChange(value)} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-wrap justify-between gap-10">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Combobox options={categories} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subCategoryId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Sub Category</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="levelId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Level</FormLabel>
                                <FormControl>
                                    <Combobox options={levels} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-10">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="29.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="estimatedPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimate Price (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="29.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Demo URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full">
                    <input
                        type="file"
                        name="thumbnail"
                        id="thumbnail"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                </div>
                <label
                    htmlFor="thumbnail"
                    className={`w-full cursor-pointer border-primary-100 rounded p-3 border flex items-center justify-center ${dragging ? 'bg-blue-500' : 'bg-transparent'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt=""
                            width={1000}
                            height={200}
                            className="max-h-full w-full object-cover"
                        />
                    ) : (
                        <span className="min-h-[200px] leading-[200px]">
                            Drag and drop your thumbnail here or click to browse
                        </span>
                    )}
                </label>
                <div className="flex">
                    <Button type="submit" className="ml-auto">
                        <span>Next</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default CourseInformation;
