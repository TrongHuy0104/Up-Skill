'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/Dialog';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/custom/Input';
import { useCreateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Course name has to be filled.' })
});

function CreateCourseForm() {
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createCourse, { data, isLoading, isSuccess, error }] = useCreateCourseMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });

    const { isSubmitting, isValid } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            name: values.name
        };
        await createCourse(data);
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Course created successfully'
            });
            setDialogOpen(false);
            form.reset();
            router.push(`/dashboard/instructor/courses/${data?.course?._id}`);
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
    }, [isSuccess, error, isLoading, router, form, data?.course?._id]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="xl">
                    Create A New Course <Image src={arrowTopRightIcon} alt="" onClick={() => setDialogOpen(true)} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl mx-auto p-6 text-primary-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Name your course</DialogTitle>
                    <DialogDescription className="text-sm text-slate-600">
                        What would you like to name your course? Don&apos;t worry, you can change this later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="e.g Advanced web development"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm">
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={!isValid || isSubmitting || isLoading}>
                                Continue
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCourseForm;
