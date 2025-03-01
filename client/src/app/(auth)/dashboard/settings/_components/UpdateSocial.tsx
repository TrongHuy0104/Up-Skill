'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { useUpdateLinkMutation } from '@/lib/redux/features/user/userApi';
import { formStyles } from '@/styles/styles';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

// Định nghĩa schema cho các trường mạng xã hội
const socialFormSchema = z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    instagram: z.string().url().optional()
});

const UpdateSocial = () => {
    const { toast } = useToast();
    const [loadUser, setLoadUser] = useState(false);
    useLoadUserQuery(undefined, { skip: !loadUser });

    // Lấy thông tin người dùng từ Redux store
    const { user } = useSelector((state: any) => state.auth);

    // Cập nhật form dựa trên thông tin người dùng
    const form = useForm<z.infer<typeof socialFormSchema>>({
        resolver: zodResolver(socialFormSchema),
        defaultValues: {
            facebook: user?.socialLinks?.facebook || '',
            twitter: user?.socialLinks?.twitter || '',
            linkedin: user?.socialLinks?.linkedin || '',
            instagram: user?.socialLinks?.instagram || ''
        }
    });

    console.log(loadUser);

    // Mutation hook để cập nhật liên kết xã hội
    const [updateLink, { isLoading, isSuccess, error }] = useUpdateLinkMutation();

    useEffect(() => {
        if (isSuccess) {
            setLoadUser(true);
            toast({
                variant: 'success',
                title: 'Social Links Updated Successfully'
            });
        }
        if (error) {
            console.error('Error updating social links:', error);
            toast({
                variant: 'destructive',
                title: 'Failed to Update',
                description: 'There was an error updating your social links.'
            });
        }
    }, [isSuccess, error, toast]);

    // Xử lý submit form
    const onSubmit = async (values: z.infer<typeof socialFormSchema>) => {
        try {
            // Gửi dữ liệu đến backend để cập nhật liên kết xã hội
            await updateLink({ data: values });
        } catch (error) {
            console.error('Error updating social links', error);
            toast({
                variant: 'destructive',
                title: 'Failed to Update',
                description: 'There was an error updating your social links.'
            });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-medium mb-4">Social Links</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Facebook */}
                    <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Facebook
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Twitter */}
                    <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Twitter
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Linkedin */}
                    <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Linkedin
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Instagram */}
                    <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Instagram
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit button */}
                    <Button type="submit" size="lg" className="mt-6" disabled={isLoading}>
                        {isLoading && <SpinnerMini />}
                        <span>Update Social</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UpdateSocial;
