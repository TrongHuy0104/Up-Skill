'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IoCameraOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSelector } from 'react-redux';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/Form';
import { formStyles } from '@/styles/styles';
import { Input } from '../ui/Input';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import { Button } from '../ui/Button';
import { useUpdateUserInfoMutation } from '@/lib/redux/features/user/userApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import SpinnerMini from '../ui/SpinnerMini';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(1, { message: 'This field has to be filled.' })
});

const ProfileInfo = () => {
    const { toast } = useToast();
    const { user } = useSelector((state: any) => state.auth);
    const [imagePreview, setImagePreview] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | ArrayBuffer | null>(null);
    const [updateUserInfo, { isLoading, isSuccess, error }] = useUpdateUserInfoMutation();
    const [loadUser, setLoadUser] = useState(false);
    useLoadUserQuery(undefined, { skip: loadUser ? false : true });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || ''
        }
    });

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
        let data: { name: string; avatar?: any } = {
            name: values.name
        };
        if (avatarImage) {
            data = {
                name: values.name,
                avatar: avatarImage
            };
        }
        await updateUserInfo(data);
    }
    return (
        <div>
            <div className="relative flex items-center gap-[30px] pb-[38px] mb-[30px] border-b border-primary-100">
                <div className="relative flex items-center justify-center p-[2px] bg-gradient-to-br from-[hsl(308,98%,60%)] to-[hsl(25,100%,55%)] rounded-full w-[120px] h-[120px]">
                    <Image
                        src={imagePreview || user?.avatar?.url}
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
                            <FormItem>
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
