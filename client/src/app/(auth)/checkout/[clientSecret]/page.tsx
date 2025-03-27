'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { redirect, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import CheckoutForm from './_components/CheckoutForm';
import Banner from '@/components/ui/Banner';
import { layoutStyles } from '@/styles/styles';
import Spinner from '@/components/custom/Spinner';
import { HiArrowUpRight } from 'react-icons/hi2';
import axios from 'axios';

interface Course {
    _id: string;
    name: string;
    price: number;
}

export default function PaymentPage() {
    const params = useParams();
    const { courses } = useSelector((state: any) => state.order);

    if (courses.length === 0) redirect('/');

    const [stripePromise, setStripePromise] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');

    const clientSecret = typeof params.clientSecret === 'string' ? params.clientSecret : undefined;

    const totalPrice = courses.reduce((total: number, course: Course) => total + course.price, 0);

    useEffect(() => {
        const initializeStripe = async () => {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            setStripePromise(stripe);
            setLoading(false);
        };

        initializeStripe();
    }, []);

    const handleApplyCoupon = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/coupon/validate`,
            { code: couponCode },
            { withCredentials: true }
          );

        } catch (error: any) {
          console.error(error);
        }
      };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {/* Banner Section */}
            <Banner
                title="Complete Your Payment"
                breadcrumbs={[{ href: '/', text: 'Home' }, { text: 'Checkout' }]}
                contentAlignment="center"
                backgroundColor="bg-accent-100"
                background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png"
            >
                <p className="text-primary-800 text-base">
                    Products that help beginner designers become true unicorns.
                </p>
            </Banner>

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
                                    <h3 className="mb-6 font-medium text-[22px] leading-7">Order Summary</h3>

                                    {/* Product List */}
                                    <div className="flex justify-between font-medium pb-2 border-b border-primary-100 mb-3">
                                        <p className="text-sm leading-7">Product</p>
                                        <p className="text-sm leading-7">Subtotal</p>
                                    </div>
                                    <ul className="mb-6">
                                        {courses.map((course: Course) => (
                                            <li key={course._id} className="mb-1 flex items-center justify-between">
                                                <p className="leading-7">{course.name}</p>
                                                <p className="leading-7">${course.price}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Total and Coupon Section */}
                                    <ul className="flex flex-col">
                                        <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100">
                                            <p className="leading-7 font-medium">Total</p>
                                            <p className="leading-7 font-medium">${totalPrice}</p>
                                        </li>
                                        <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100 mt-2">
                                            <p className="leading-7 font-medium">Coupon</p>
                                            <p className="leading-7 font-medium">$0</p>
                                        </li>
                                        <li className="mb-1 flex items-center justify-between pb-[10px] mt-4">
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">Total</p>
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">
                                                ${totalPrice}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            {/* Coupon Code Input */}
                            <div className="bg-white py-4 max-w-[400px] rounded-xl justify-end">
                                <div className="relative flex items-center gap-4">
                                    <div className="relative w-[260px] py-4">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder=" "
                                            className="w-full ml-2 peer flex-grow border-b-2 border-primary-100 rounded-none pt-4 text-primary-800 text-base focus:outline-none focus:border-primary-800"
                                        />
                                        <label
                                            htmlFor="couponCode"
                                            className="w-full absolute left-2 top-0.5 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-primary-800 peer-focus:top-1 peer-focus:text-primary-800"
                                        >
                                            Coupon Code
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="w-[140px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 flex items-center justify-center gap-2 text-base font-medium"
                                    >
                                        Apply <HiArrowUpRight />
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}