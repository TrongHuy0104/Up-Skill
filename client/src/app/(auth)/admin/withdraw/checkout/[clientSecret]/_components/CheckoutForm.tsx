'use client';

import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@/components/ui/Button';
import { redirect } from 'next/navigation';
import { incomeRemovePaymentIntent } from '@/lib/redux/features/income/incomeSlice';
import { useCreateTransactionMutation } from '@/lib/redux/features/income/incomeApi';
import { toast } from '@/hooks/use-toast';

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { request } = useSelector((state: any) => state.income);
    const { user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    const [message, setMessage] = useState<string>('');
    const [createTransaction, { isLoading: isLoadingTransaction }] = useCreateTransactionMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });
        if (error) {
            setMessage(error.message!);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setIsLoading(false);
            const data = {
                incomeId: request._id,
                requestId: request.requests._id,
                amount: request.requests.amount,
                payment_info: paymentIntent
            };
            await createTransaction(data);
            toast({
                variant: 'success',
                title: 'Create transaction successfully'
            });
            dispatch(incomeRemovePaymentIntent());
        }
    };

    useEffect(() => {
        if (!request) {
            redirect(`/admin/withdraw`);
        }
    }, [request]);

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
                options={{ defaultValues: { email: user?.email || 'example@gmail.com' } }}
            />
            <PaymentElement id="payment-element" />
            <Button
                disabled={isLoading || !stripe || !elements || isLoadingTransaction}
                id="submit"
                className="mt-5 text-base"
            >
                <span id="button-text">{isLoading || isLoadingTransaction ? 'Paying...' : 'Pay now'}</span>
            </Button>
            {message && (
                <div id="payment-message" className="text-[#df1b41] text-base">
                    {message}
                </div>
            )}
        </form>
    );
}

export default CheckoutForm;
