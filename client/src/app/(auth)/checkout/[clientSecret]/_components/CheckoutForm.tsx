import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/components/ui/Button';
import { useCreateOrderMutation } from '@/lib/redux/features/order/orderApi';
import { redirect } from 'next/navigation';

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { courses } = useSelector((state: any) => state.order);
    const { user } = useSelector((state: any) => state.auth);

    const [message, setMessage] = useState<string>('');
    const [createOrder, { data: orderData, isLoading: isLoadingCreateOrder }] = useCreateOrderMutation();
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
            const courseIds = courses.map((course: any) => course._id);
            await createOrder({ courseIds, payment_info: paymentIntent });
        }
    };

    useEffect(() => {
        if (orderData?.order?._id) {
            redirect(`/orders/${orderData.order._id}`);
        }
    }, [orderData]);
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
                options={{ defaultValues: { email: user?.email || 'example@gmail.com' } }}
            />
            <PaymentElement id="payment-element" />
            <Button
                disabled={isLoading || !stripe || !elements || isLoadingCreateOrder}
                id="submit"
                className="mt-5 text-base"
            >
                <span id="button-text">{isLoading || isLoadingCreateOrder ? 'Paying...' : 'Pay now'}</span>
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
