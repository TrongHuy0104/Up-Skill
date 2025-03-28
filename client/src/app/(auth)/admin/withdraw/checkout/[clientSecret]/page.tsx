'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { redirect, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import CheckoutForm from './_components/CheckoutForm';
import { layoutStyles } from '@/styles/styles';
import Spinner from '@/components/custom/Spinner';

export default function PaymentPage() {
    const params = useParams();
    const { request } = useSelector((state: any) => state.income);

    if (!request) redirect('/admin/withdraw');

    const [stripePromise, setStripePromise] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const clientSecret = typeof params.clientSecret === 'string' ? params.clientSecret : undefined;

    useEffect(() => {
        const initializeStripe = async () => {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            setStripePromise(stripe);
            setLoading(false);
        };

        initializeStripe();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {/* Payment Content Section */}
            <div className="pt-[55px] pb-[130px]">
                <div className={layoutStyles.container}>
                    <div className={layoutStyles.row}>
                        {/* Checkout Form Section */}
                        <div className="w-2/3">
                            <div className="p-10 border border-primary-100 rounded-xl">
                                {stripePromise && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret, locale: 'en' }}>
                                        <CheckoutForm />
                                    </Elements>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="w-1/3">
                            <div className="flex flex-col max-w-[400px] gap-10 ml-auto">
                                <div className="pt-10 px-10 pb-5 border border-primary-100 rounded-xl">
                                    <h3 className="mb-6 font-medium text-[22px] leading-7">Withdraw Summary</h3>

                                    {/* Product List */}
                                    <div className="flex justify-between font-medium pb-2 border-b border-primary-100 mb-3">
                                        <p className="text-sm leading-7">Instructor</p>
                                    </div>
                                    <ul className="mb-6">
                                        <div className="mb-1">
                                            <p className="leading-7">{request.user.name}</p>
                                        </div>
                                        <div className="mb-1">
                                            <p className="leading-7">{request.user.email}</p>
                                        </div>
                                    </ul>

                                    {/* Total and Coupon Section */}
                                    <ul className="flex flex-col">
                                        <li className="mb-1 flex items-center justify-between pb-[10px] mt-4">
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">Total</p>
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">
                                                ${request.requests.amount}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
