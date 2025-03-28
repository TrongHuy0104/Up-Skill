'use client';

import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiArrowUpRight } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { computeSalePercent } from '@/lib/utils';
import { Course } from '@/types/Course';
import { useCreatePaymentIntentMutation } from '@/lib/redux/features/order/orderApi';
import { orderCreatePaymentIntent, setCouponInfo } from '@/lib/redux/features/order/orderSlice';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { CourseSidebarSkeleton } from '@/components/ui/Skeleton';
import VideoPlayer from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/VideoPlayer';
import axios from 'axios';
import { addCartItem } from '@/lib/redux/features/cart/cartSlice';
import { toast } from '@/hooks/use-toast';

interface CourseSidebarProps {
    course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector((state: any) => state.cart);
    const [createPaymentIntent, { data: paymentIntentData, isLoading }] = useCreatePaymentIntentMutation();
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
    const [user, setUser] = useState<any>({});
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [coursePrice, setCoursePrice] = useState(course.price);

    useEffect(() => {
        setUser(userData?.user);
    }, [isLoadingUser, userData?.user]);

    const [stripePromise, setStripePromise] = useState<any>(null);

    const createPayment = async () => {
        if (!user) redirect('/');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripePromise(stripe);
        const amount = Math.round(course.price * 100);
        dispatch(orderCreatePaymentIntent({
            course,
            couponInfo: {
                discountPercentage: discount,
                discountedTotal: coursePrice,
                couponCode: couponCode,
            }
        }));
        const paymentIntentResult = await createPaymentIntent(amount).unwrap();
        redirect(`/checkout/${paymentIntentResult?.client_secret}`);
        };

    const checkCourseExistInCart = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/cart-items`, {
                withCredentials: true
            });
            if (response.data.cart && response.data.cart.items) {
                const cartItems = response.data.cart.items;
                const courseExists = cartItems.some((items: any) => items.courseId === course._id);
                return courseExists;
            } 
        } catch (error) {
            console.error('Error checking if course is in cart:', error);
            return false;
        }
    };

    const addToCart = async () => {
        if (!user) {
            redirect('/');
        }

        if (!course?._id) {
            console.error('Course ID is undefined');
            return;
        }

        try {
            const isCourseInCart = cartItems.some((items: any) => {
                return items.courseId._id === course._id;
            });
            if (!isCourseInCart) {
                const addResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/cart/add-to-cart`,
                    { courseId: course._id },
                    { withCredentials: true }
                );

                if (addResponse.data.success) {
                    dispatch(addCartItem({ courseId: course._id }));
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    useEffect(() => {
        if (user) {
            checkCourseExistInCart();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, course._id]);

    const checkCourseExist = () => {
        if (user) {
            return user?.purchasedCourses?.find((purchasedCourses: any) => purchasedCourses === course._id);
        }
        return false;
    };

    useEffect(() => {
        if (paymentIntentData && stripePromise && !isLoading) {
            redirect(`/checkout/${paymentIntentData?.client_secret}`);
        }
    }, [paymentIntentData, stripePromise, isLoading]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCoursePrice(course.price);
            setDiscount(0);
            toast({
                variant: 'destructive',
                title: 'Please enter a coupon code',
            });
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/coupon/validate`,
                { code: couponCode },
                { withCredentials: true }
            );
    
            if (response.data.success) {
                setDiscount(response.data.discountPercentage);
                const newPrice = course.price - (course.price * (response.data.discountPercentage / 100));
                setCoursePrice(newPrice);
                dispatch(setCouponInfo({
                    discountPercentage: response.data.discountPercentage,
                    discountedTotal: newPrice,
                    couponCode: couponCode,
                }));
                toast({
                    variant: 'success',
                    title: `Coupon applied successfully! ${response.data.discountPercentage}% discount.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: response.data.message || 'Invalid or expired.'
                });
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className="w-full rounded-2xl shadow-lg bg-primary-50 border min-w-[330px] max-w-4xl  lg:w-[400px]">
            <div className="relative w-full h-[260px] flex justify-center items-center">
                <Image
                    src={course?.thumbnail?.url || '/assets/images/courses/courses-03.jpg'}
                    alt="Course Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg w-full min-w-[330px] max-w-none lg:w-[400px]"
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="absolute w-16 h-16 bg-primary-50 rounded-3xl flex justify-center items-center shadow-md cursor-pointer group">
                            <div
                                className="w-4 h-4 bg-primary-900 group-hover:bg-accent-900 mask mask-image"
                                style={{
                                    WebkitMaskImage: 'url(/assets/icons/play.svg)',
                                    maskImage: 'url(/assets/icons/play.svg)',
                                    WebkitMaskSize: 'contain',
                                    maskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat'
                                }}
                            ></div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] md:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Course Preview</DialogTitle>
                        </DialogHeader>
                        <VideoPlayer videoUrl={course?.demoUrl?.url || ''} />
                    </DialogContent>
                </Dialog>
            </div>
            {isLoadingUser ? (
                <CourseSidebarSkeleton />
            ) : (
                <>
                    <div className="p-6 flex justify-center items-center">
                        <p className="text-[26px] font-base text-accent-900 font-semibold mr-4">
                            ${coursePrice.toFixed(2)}
                        </p>
                        <p className="text-[15px] text-primary-800 line-through mr-12">
                            ${course?.estimatedPrice?.toFixed(2)}
                        </p>
                        <p className="text-[14px] text-accent-900 bg-accent-100 font-medium py-2 px-4 border border-accent-900 rounded-lg">
                            ${(computeSalePercent(course.price, course?.estimatedPrice || 0) + discount).toFixed(2)}% OFF
                        </p>
                    </div>
                    <div>
                        {checkCourseExist() ? (
                            <Link
                                href={`/courses/${course._id}/learn`}
                                className="w-[320px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 transition-colors duration-300 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
                            >
                                Go To Course <HiArrowUpRight />
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={addToCart}
                                    className="w-[320px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 transition-colors duration-300 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
                                >
                                    Add To Cart <HiArrowUpRight />
                                </button>
                                <button
                                    onClick={createPayment}
                                    className="w-[320px] bg-primary-50 text-primary-800 px-6 py-4 rounded-md border border-primary-800 transition-colors duration-300 hover:border-accent-900 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
                                >
                                    Buy Now <HiArrowUpRight />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-center text-sm text-primary-800">30-Day Money-Back Guarantee</p>
                    <div className="p-6 space-y-4 text-sm">
                        <p className="text-[18px] font-medium text-primary-800 py-2">This course includes:</p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image
                                src="/assets/icons/play-outline.svg"
                                alt="Play-Outline Icon"
                                width={16}
                                height={16}
                            />
                            {200} hours on-demand video
                        </p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image src="/assets/icons/article.svg" alt="Timetable Icon" width={16} height={16} />
                            {200} articles
                        </p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image src="/assets/icons/download.svg" alt="Arrow-Down Icon" width={16} height={16} />
                            {200} downloadable resources
                        </p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image src="/assets/icons/access-mobile.svg" alt="Cart Icon" width={14} height={14} />
                            Access on mobile and TV
                        </p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image src="/assets/icons/full-lifetime.svg" alt="Hour Icon" width={16} height={16} />
                            Full lifetime access
                        </p>
                        <p className="text-[15px] text-primary-800 flex items-center gap-2">
                            <Image src="/assets/icons/certificate.svg" alt="Star-Outline Icon" width={16} height={16} />
                            Certificate of completion
                        </p>
                    </div>
                    {!checkCourseExist() && (
                    <div className="px-6">
                                <div className="flex items-center justify-between">
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-[250px] p-2 border border-gray-300 rounded-lg" />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-primary-800 text-primary-50 px-6 py-2 rounded-md hover:bg-accent-900 transition-colors duration-300 flex items-center justify-center"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discount > 0 && <p className="text-green-500 text-sm mt-2">Discount: {discount}%</p>}
                        
                            </div>
                        )}
                        <div className="text-center mt-6 pt-6 border-t">
                                    <p className="text-[16px] font-medium text-primary-800">Share this course</p>
                                    <div className="flex justify-center gap-4 mt-4 mb-4">
                                        <a
                                            href="#"
                                            className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-accent-500 text-sm"
                                        >
                                            <FaFacebookF />
                                        </a>
                                        <a
                                            href="#"
                                            className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-accent-500 text-sm"
                                        >
                                            <FaXTwitter />
                                        </a>
                                        <a
                                            href="#"
                                            className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-accent-500 text-sm"
                                        >
                                            <FaInstagram />
                                        </a>
                                        <a
                                            href="#"
                                            className="cursor-pointer text-primary-800 border rounded-full p-3 hover:text-accent-500 text-sm"
                                        >
                                            <FaLinkedinIn />
                                        </a>
                                    </div>
                                </div></>
            )}
        </div>
    );
};

export default CourseSidebar;