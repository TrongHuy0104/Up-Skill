'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';

import CheckoutForm from './_components/CheckoutForm';
import Banner from '@/components/ui/Banner';
import { layoutStyles } from '@/styles/styles';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
    const params = useParams();
    const { courses } = useSelector((state: any) => state.order);

    const clientSecret = typeof params.clientSecret === 'string' ? params.clientSecret : undefined;

    const totalPrice = courses.reduce((totalPrice: number, course: any) => (totalPrice += course.price), 0);

    return (
        <>
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
            <div className="pt-[55px] pb-[130px]">
                <div className={layoutStyles.container}>
                    <div className={`${layoutStyles.row}`}>
                        <div className="w-2/3">
                            <div className="p-10 border border-primary-100 rounded-xl">
                                <Elements stripe={stripePromise} options={{ clientSecret, locale: 'en' }}>
                                    <CheckoutForm />
                                </Elements>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <div className="flex flex-col max-w-[400px] gap-10 ml-auto">
                                <div className="pt-10 px-10 pb-5 border border-primary-100 rounded-xl">
                                    <h3 className="mb-6 font-medium text-[22px] leading-7">Order Summary</h3>
                                    <div className="flex justify-between font-medium pb-2 border-b border-primary-100 mb-3">
                                        <p className="text-sm leading-7">Product</p>
                                        <p className="text-sm leading-7">Subtotal</p>
                                    </div>
                                    <ul className="mb-6">
                                        {courses.map((course: any) => (
                                            <li key={course._id} className="mb-1 flex items-center justify-between">
                                                <p className="leading-7">{course.name}</p>
                                                <p className="leading-7">${course.price} </p>
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="fle flex-col">
                                        <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100">
                                            <p className="leading-7 font-medium">Total</p>
                                            <p className="leading-7 font-medium">${totalPrice} </p>
                                        </li>
                                        <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100 mt-2">
                                            <p className="leading-7 font-medium">Coupon</p>
                                            <p className="leading-7 font-medium">$0 </p>
                                        </li>
                                        <li className="mb-1 flex items-center justify-between pb-[10px] mt-4">
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">Total</p>
                                            <p className="leading-[30px] font-medium text-accent-900 text-xl">
                                                ${totalPrice}{' '}
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
