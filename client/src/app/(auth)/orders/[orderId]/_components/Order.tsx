'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Spinner from '@/components/custom/Spinner';
import { useGetOrderQuery } from '@/lib/redux/features/order/orderApi';
import { layoutStyles } from '@/styles/styles';
import { Button } from '@/components/ui/Button';
import completeIcon from '@/public/assets/icons/order-completed.svg';
import useUserRedirect from '@/hooks/useUserRedirect';
import { useSelector } from 'react-redux';

type Props = { orderId: string };

interface Course {
    _id: string;
    name: string;
    price: number;
}

function Order({ orderId }: Props) {
    const { isLoadingUser } = useUserRedirect();
    const { data, isLoading } = useGetOrderQuery(orderId);
    const { couponInfo } = useSelector((state: any) => state.order);

    if (isLoadingUser || isLoading) return <Spinner />;

    if (!data) return null;
    const { order, position } = data;

    const totalPrice = order.courseIds.reduce((total: number, course: Course) => total + course.price, 0);
    const discountAmount = couponInfo.discountPercentage || 0;
    const discountedTotal = couponInfo.discountedTotal || totalPrice;

    return (
        <div className="py-[160px]">
            <div className={layoutStyles.container}>
                <div className={`${layoutStyles.row} justify-center`}>
                    <div className="w-2/3">
                        {/* Order Completed Section */}
                        <div className="flex flex-col items-center pb-12 text-primary-800">
                            <div className="h-20 w-20 rounded-full bg-accent-100 flex items-center justify-center mb-3">
                                <Image src={completeIcon} alt="Order Completed" />
                            </div>
                            <h2 className="font-bold mb-[5px] text-4xl leading-[50px] tracking-[1px]">
                                Your Order Is Completed!
                            </h2>
                            <p>Thank you. Your order has been received.</p>
                            <Link href="/">
                                <Button className="mt-4 text-base">Back to home page</Button>
                            </Link>
                        </div>

                        {/* Order Details Section */}
                        <div className="flex justify-between px-[60px] py-8 bg-accent-100 border-2 border-dashed border-accent-900 rounded-lg mb-14 mx-2">
                            <div>
                                <p className="font-medium leading-7">Order Number</p>
                                <p className="leading-7">{position}</p>
                            </div>
                            <div>
                                <p className="font-medium leading-7">Date</p>
                                <p className="leading-7">April 06 2024</p>
                            </div>
                            <div>
                                <p className="font-medium leading-7">Total</p>
                                <p className="leading-7">${discountedTotal.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="rounded-xl">
                            <div className="pt-[34px] px-10 pb-8 border border-primary-100 rounded-xl mx-3">
                                <h3 className="text-[22px] font-medium mb-6 leading-7">Order Summary</h3>
                                <div className="flex justify-between font-medium pb-2 border-b border-primary-100 mb-3">
                                    <p className="text-sm leading-7">Product</p>
                                    <p className="text-sm leading-7">Subtotal</p>
                                </div>
                                <ul className="mb-6">
                                    {order.courseIds.map((course: Course) => (
                                        <li key={course._id} className="mb-1 flex items-center justify-between">
                                            <p className="leading-7">{course.name}</p>
                                            <p className="leading-7">${course.price.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="flex flex-col">
                                    <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100">
                                        <p className="leading-7 font-medium">Total</p>
                                        <p className="leading-7 font-medium">${totalPrice.toFixed(2)}</p>
                                    </li>
                                    <li className="mb-1 flex items-center justify-between pb-[10px] border-b border-primary-100 mt-2">
                                        <p className="leading-7 font-medium">Discount Applied</p>
                                        <p className="leading-7 font-medium">{discountAmount.toFixed(2)}%</p>
                                    </li>
                                    <li className="mb-1 flex items-center justify-between pb-[10px] mt-4">
                                        <p className="leading-[30px] font-medium text-accent-900 text-xl">Total</p>
                                        <p className="leading-[30px] font-medium text-accent-900 text-xl">
                                            ${discountedTotal.toFixed(2)}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;