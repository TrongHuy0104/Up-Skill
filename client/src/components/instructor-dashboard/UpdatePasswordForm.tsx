'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import defaultAvatar from '@/public/assets/images/avatar/user-4.png';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/Form';
import { formStyles } from '@/styles/styles';
import { Input } from '../ui/Input';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import { Button } from '../ui/Button';
import { useUpdatePasswordMutation } from '@/lib/redux/features/user/userApi';
import SpinnerMini from '../ui/SpinnerMini';
import { useToast } from '@/hooks/use-toast';

// Define reusable password validation schema
const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(20, { message: 'Password must be at most 20 characters long.' })
    .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter.'
    })
    .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter.'
    })
    .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number.'
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Password must contain at least one special character.'
    });

// Define the form schema
const formSchema = z
    .object({
        oldPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, { message: 'This field is required.' })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword']
    });

const UpdatePasswordForm = () => {
    const { toast } = useToast();
    const [updatePassword, { isLoading, isSuccess, error }] = useUpdatePasswordMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Update Password Successfully'
            });
            form.reset();
        }
        if (error) {
            let errorMessage = 'Something went wrong. Please try again!';

            if ('data' in error && typeof error.data === 'string') {
                errorMessage = error.data;
            } else if ('message' in error && typeof error.message === 'string') {
                errorMessage = error.message;
            }

            toast({
                variant: 'destructive',
                title: errorMessage
            });
        }
    }, [isSuccess, error, toast, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await updatePassword({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        });
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="password" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Current Password
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="mt-6">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="password" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            New Password
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="mt-6">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="password" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Re-Type New Password
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" size="lg" className="mt-6" disabled={isLoading}>
                        {isLoading && <SpinnerMini />}
                        <span>Update Password</span> <Image src={arrowTopRightIcon} alt="" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UpdatePasswordForm;
