'use client';

import SpinnerMini from '@/components/custom/SpinnerMini';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { toast } from '@/hooks/use-toast';
import {
    useGetAllWithdrawRequestsQuery,
    useRejectWithdrawRequestMutation
} from '@/lib/redux/features/income/incomeApi';
import { incomeCreatePaymentIntent } from '@/lib/redux/features/income/incomeSlice';
import { useCreatePaymentIntentMutation } from '@/lib/redux/features/order/orderApi';
import { formatCurrency } from '@/utils/helpers';
import { loadStripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function RequestList() {
    const dispatch = useDispatch();
    const { data: requestsRes, isLoading: isLoadingRequestsData, refetch } = useGetAllWithdrawRequestsQuery(undefined);
    const [rejectWithdrawRequest, { isLoading: isLoadingReject, isSuccess: isRejectSuccess, error: rejectError }] =
        useRejectWithdrawRequestMutation();
    const [createPaymentIntent, { data: paymentIntentData, isLoading }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState<any>(null);

    const createPayment = async (request: any) => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripePromise(stripe);
        const amount = Math.round(request.requests.amount * 100);
        await createPaymentIntent(amount);
        dispatch(incomeCreatePaymentIntent({ request }));
    };

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (isRejectSuccess) {
            toast({
                variant: 'success',
                title: 'Reject withdraw successfully'
            });
            refetch();
        }
        if (rejectError) {
            if ('data' in rejectError) {
                const errorData = rejectError as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isRejectSuccess, rejectError, refetch]);

    useEffect(() => {
        if (paymentIntentData && stripePromise && !isLoading) {
            redirect(`/admin/withdraw/checkout/${paymentIntentData?.client_secret}`);
        }
    }, [paymentIntentData, stripePromise, isLoading]);

    if (isLoadingRequestsData) {
        return <SpinnerMini />;
    }

    const { data: requests } = requestsRes;

    const handleReject = async (incomeId: string, requestId: string) => {
        const data = { incomeId, requestId };
        rejectWithdrawRequest(data);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Withdraw Requests</h2>
            <div className="rounded-xl overflow-hidden border border-gray-300 bg-white">
                <Table className="bg-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request: any, index: number) => (
                            <Fragment key={request._id}>
                                <TableRow className="hover:bg-gray-200 transition-all">
                                    <TableCell className="font-semibold text-black">{index + 1}</TableCell>
                                    <TableCell className="text-gray-600">{request.user.name}</TableCell>
                                    <TableCell className="text-gray-600">{request.user.email}</TableCell>
                                    <TableCell className="text-gray-600">
                                        {formatCurrency(request.requests.amount)}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {format(new Date(request.requests.createdAt), 'MM/dd/yyyy hh:mm:ss a')}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-white text-sm 
                                                    bg-yellow-500`}
                                        >
                                            Pending
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Button size={'sm'} onClick={() => createPayment(request)}>
                                                Pay now
                                            </Button>
                                            <Button
                                                size="sm"
                                                disabled={isLoadingReject}
                                                onClick={() => handleReject(request._id, request.requests._id)}
                                            >
                                                {isLoadingReject && <SpinnerMini />} Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {requests.length === 0 && <p className="text-center text-gray-500 mt-4">No request</p>}
        </div>
    );
}
