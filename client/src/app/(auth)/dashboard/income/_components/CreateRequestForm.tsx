'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
    DialogTitle,
    DialogTrigger
} from '@/components/ui/Dialog';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/custom/Input';
import { toast } from '@/hooks/use-toast';
import { useCreateWithdrawRequestMutation } from '@/lib/redux/features/income/incomeApi';

const formSchema = z.object({
    amount: z
        .number({ invalid_type_error: 'Amount must be a number.' })
        .min(1, { message: 'Withdraw amount must be at least $1' })
});

function CreateWithdrawRequestForm({ userId, remain, refetch }: { userId: string; remain: number; refetch: any }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createWithdrawRequest, { isLoading, isSuccess, error }] = useCreateWithdrawRequestMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0
        }
    });

    const { isSubmitting, isValid } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.amount > remain)
            return toast({
                variant: 'destructive',
                title: `Your remain amount is {formatCurrency(remain)}`
            });
        const data = {
            userId,
            amount: values.amount
        };

        await createWithdrawRequest(data);
    }

    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Withdraw request submitted'
            });
            refetch();
            setDialogOpen(false);
            form.reset();
        }
        if (error && 'data' in error) {
            const err = error as any;
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: err.data?.message || 'Please try again later.'
            });
        }
    }, [isSuccess, error, isLoading, form, refetch]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="xl">
                    Create Request <Image src={arrowTopRightIcon} alt="" onClick={() => setDialogOpen(true)} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl mx-auto p-6 text-primary-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Withdraw Request</DialogTitle>
                    <DialogDescription className="text-sm text-slate-600">
                        Please enter the amount you&apos;d like to withdraw. Make sure your payment details are up to
                        date.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            disabled={isSubmitting}
                                            placeholder="e.g. 100.00"
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm">
                                        Enter the amount in USD you wish to withdraw
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={!isValid || isSubmitting || isLoading}>
                                Request Withdrawal
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateWithdrawRequestForm;
