'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { formStyles } from '@/styles/styles';
import Image from 'next/image';
import Star from '@/public/assets/icons/star.svg';
import MoreSectionWhite from '@/public/assets/icons/more-sections-white.svg';

const formSchema = z.object({
    email: z.string().min(1, { message: 'This field has to be filled.' }).email('This is not a valid email.'),
    firstName: z.string().min(1, { message: 'First name is required.' }),
    phone: z
        .string()
        .min(1, { message: 'Phone is required.' })
        .regex(/^\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/, {
            message: 'Phone must be a valid phone number.'
        })
        .refine((value) => value.replace(/\D/g, '').length >= 10, {
            message: 'Phone number must have at least 10 digits.'
        }),

    title: z.string().min(1, { message: 'Title is required.' }),
    content: z.string().min(1, { message: 'Content is required.' })
});

const FormReview = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            email: '',
            phone: '',
            title: '',
            content: ''
        }
    });

    const onSubmit = (values: any) => {
        console.log(values);
        // Handle form submission here
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-9 py-14 bg-white  border-[1px] rounded-xl mt-14 w-[900px] "
            >
                <h2 className="text-xl font-semibold">Leave A Reply</h2>
                <p className="text-primary-800 text-sm mb-4 pt-4">
                    Your email address will not be published. Required fields are marked *
                </p>

                <div className="mb-4">
                    <span className="font-medium">Ratings </span>
                    <div className="flex space-x-1 mt-1 pb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Image key={star} src={Star} alt="Star Icon" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-2 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            First Name
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="email" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-2 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Email
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-2 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Phone
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <fieldset className={formStyles.fieldset}>
                                        <Input {...field} type="text" className={formStyles.textInput} />
                                        <FormLabel
                                            className={`-z-2 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                                        >
                                            Title
                                        </FormLabel>
                                    </fieldset>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <fieldset className={formStyles.fieldset}>
                                    <textarea {...field} className={`${formStyles.textInput} p-2  w-full h-24 mb-4`} />
                                    <FormLabel
                                        className={`-z-2 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : 'translate-y-[-60px]'}`}
                                    >
                                        Your Comment
                                    </FormLabel>
                                </fieldset>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center mb-8">
                    <input type="checkbox" id="saveInfo" className="mr-2 cursor-pointer checked:bg-black" />
                    <label htmlFor="saveInfo" className="text-sm text-primary-800">
                        Save my name, email, and website in this browser for the next time I comment.
                    </label>
                </div>

                <Button type="submit" className="w-full">
                    <span>Post Comment</span>
                    <Image src={MoreSectionWhite} alt="MoreSection Icon" />
                </Button>
            </form>
        </Form>
    );
};

export default FormReview;
