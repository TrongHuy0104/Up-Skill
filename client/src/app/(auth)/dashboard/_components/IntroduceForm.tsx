'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/custom/Input';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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

interface IntroduceFormProps {
    onClose: () => void;
}

function IntroduceForm({ onClose }: IntroduceFormProps) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            introduce: '',
            phoneNumber: '',
            address: '',
            age: 0,
            profession: ''
        }
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Parse age to ensure it's a number
            const parsedValues = {
                ...values,
                age: values.age ? Number(values.age) : undefined // Convert to number
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/update-instructor-infor`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(parsedValues) // Use parsed values
            });

            if (!response.ok) {
                throw new Error('Failed to update instructor information.');
            }

            toast({
                variant: 'success',
                title: 'Information updated successfully'
            });

            form.reset();
            onClose();
            router.push('/');
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error updating information',
                description: 'Please try again later.'
            });
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-3xl mx-auto p-6 text-primary-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Enter Your Information</DialogTitle>
                    <DialogDescription className="text-sm text-slate-600">
                        Please provide the following details.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="introduce"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Introduce</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            disabled={isSubmitting}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profession</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" onClick={() => onSubmit(form.getValues())}>
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default IntroduceForm;
