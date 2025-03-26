'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IoCameraOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSelector } from 'react-redux';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { formStyles } from '@/styles/styles';
import { Input } from '@/components/ui/Input';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';
import { Button } from '@/components/ui/Button';
import { useUpdateUserInfoMutation } from '@/lib/redux/features/user/userApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { useToast } from '@/hooks/use-toast';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

const formSchema = z.object({
    name: z.string().min(1, { message: 'This field has to be filled.' }),
    profession: z.string().min(1, { message: 'This field has to be filled.' }),
    introduce: z.string().optional(),
    age: z.number().min(0, { message: 'Age must be a positive number' }).optional(),
    address: z.string().min(1, { message: 'This field has to be filled.' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'This field has to be filled.' })
        .max(15, { message: 'Phone number must be at most 15 digits.' })
        .regex(/^\+?\d{10,15}$/, { message: 'Phone number must contain only numbers.' })
});

const ProfileInfo = () => {
    const { toast } = useToast();
    const { user } = useSelector((state: any) => state.auth);
    const [imagePreview, setImagePreview] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | ArrayBuffer | null>(null);
    const [updateUserInfo, { isLoading, isSuccess, error }] = useUpdateUserInfoMutation();
    const [loadUser, setLoadUser] = useState(false);
    useLoadUserQuery(undefined, { skip: !loadUser });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            profession: user?.profession || '',
            introduce: user?.introduce || '',
            age: user?.age || undefined,
            address: user?.address || '',
            phoneNumber: user?.phoneNumber || ''
        }
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user?.name || '',
                profession: user?.profession || '',
                introduce: user?.introduce || '',
                age: user?.age || undefined,
                address: user?.address || '',
                phoneNumber: user?.phoneNumber || ''
            });
        }
    }, [user, form]); // Mỗi khi user thay đổi, reset form với dữ liệu mới

    useEffect(() => {
        if (isSuccess) {
            setLoadUser(true);
            toast({
                variant: 'success',
                title: 'Update User Successfully'
            });
        }
        if (error) {
            console.log(error);
        }
    }, [isSuccess, error, toast]);

    const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagePreview(URL.createObjectURL(e.target.files[0]));

            const fileReader = new FileReader();

            fileReader.onload = () => {
                if (fileReader.readyState === 2) {
                    const avatar = fileReader.result;
                    setAvatarImage(avatar);
                }
            };
            fileReader.readAsDataURL(e.target.files[0]);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let data: {
            name: string;
            profession?: string;
            introduce?: string;
            age?: number;
            avatar?: any;
            address?: string;
            phoneNumber?: string;
        } = {
            name: values.name,
            profession: values.profession,
            introduce: values.introduce,
            age: values.age,
            address: values.address,
            phoneNumber: values.phoneNumber
        };
        if (avatarImage) {
            data = {
                name: values.name,
                avatar: avatarImage,
                profession: values.profession,
                introduce: values.introduce,
                age: values.age,
                phoneNumber: values.phoneNumber,
                address: values.address
            };
        }
        await updateUserInfo(data);
    }

    if (!user) return <DashboardSkeleton />;
    return (
        <div>
            <div className="relative flex items-center gap-[30px] pb-[38px] mb-[30px] border-b border-primary-100">
                <div className="relative flex items-center justify-center p-[2px] bg-gradient-to-br from-[hsl(308,98%,60%)] to-[hsl(25,100%,55%)] rounded-full w-[120px] h-[120px]">
                    <Image
                        src={user?.avatar?.url || imagePreview || defaultAvatar}
                        alt="Avatar"
                        width={120}
                        height={120}
                        className="w-full h-full rounded-full border-[10px] border-primary-50 bg-primary-50 object-cover"
                    />
                    <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                    <label htmlFor="avatar">
                        <div className="w-[30px] h-[30px] bg-primary-50 border border-primary-100 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <IoCameraOutline size={20} className="z-1" />
                        </div>
                    </label>
                </div>
                <div className="text-primary-800">
                    <h4 className="text-xl font-medium">Your avatar</h4>
                    <p className="text-sm">PNG or JPG no bigger than 800px wide and tall.</p>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Name
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input
                                            {...field}
                                            type="number"
                                            className={formStyles.textInput}
                                            onChange={(e) =>
                                                field.onChange(e.target.value ? Number(e.target.value) : '')
                                            }
                                        />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Age
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Profession
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Address
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Phone Number
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="introduce"
                        render={({ field }) => (
                            <FormItem className="py-1">
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <textarea
                                            {...field}
                                            className={`${formStyles.textInput} p-2  w-full h-24 mb-4`}
                                        />
                                        <FormLabel
                                            className={`-z-2  ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : 'translate-y-[-60px]'}`}
                                        >
                                            Introduce
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" size="lg" className="mt-6" disabled={isLoading}>
                        {isLoading && <SpinnerMini />}
                        <span>Update Profile</span> <Image src={arrowTopRightIcon} alt="" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ProfileInfo;
