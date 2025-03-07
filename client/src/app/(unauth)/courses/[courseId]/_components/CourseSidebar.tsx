'use client';

import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiArrowUpRight } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { computeSalePercent } from '@/lib/utils';
import { Course } from '@/types/Course';
import { useCreatePaymentIntentMutation } from '@/lib/redux/features/order/orderApi';
import { orderCreatePaymentIntent } from '@/lib/redux/features/order/orderSlice';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { CourseSidebarSkeleton } from '@/components/ui/Skeleton';
import VideoPlayer from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/VideoPlayer';

interface CourseSidebarProps {
    course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
    const dispatch = useDispatch();
    const [createPaymentIntent, { data: paymentIntentData, isLoading }] = useCreatePaymentIntentMutation();
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
    const [user, setUser] = useState<any>({});
    useEffect(() => {
        setUser(userData?.user);
    }, [isLoadingUser, userData?.user]);

    const [stripePromise, setStripePromise] = useState<any>(null);

    const createPayment = async () => {
        if (!user) redirect('/');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripePromise(stripe);
        const amount = Math.round(course.price * 100);
        await createPaymentIntent(amount);
        dispatch(orderCreatePaymentIntent({ course }));
    };

    const checkCourseExist = () => {
        if (user) {
            return user?.purchasedCourses?.find((purchasedCourse: any) => purchasedCourse === course._id);
        }
        return false;
    };

    useEffect(() => {
        if (paymentIntentData && stripePromise && !isLoading) {
            redirect(`/checkout/${paymentIntentData?.client_secret}`);
        }
    }, [paymentIntentData, stripePromise, isLoading]);
    // if (isLoadingUser) return <CourseSideBarSkeleton />;
    return (
        <div className="w-[400px] rounded-2xl shadow-lg bg-primary-50 border">
            <div className="relative w-full h-[260px] flex justify-center items-center">
                <Image
                    src={course?.thumbnail?.url || '/assets/images/courses/courses-03.jpg'}
                    alt="Course Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
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
                            ${course?.price?.toFixed(2)}
                        </p>
                        <p className="text-[15px] text-primary-800 line-through mr-12">
                            ${course?.estimatedPrice?.toFixed(2)}
                        </p>
                        <p className="text-[14px] text-accent-900 bg-accent-100 font-medium py-2 px-4 border border-accent-900 rounded-lg">
                            ${computeSalePercent(course.price, course?.estimatedPrice || 0).toFixed(2)}% OFF
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
                                <a
                                    href="#"
                                    className="w-[320px] bg-primary-800 text-primary-50 px-6 py-4 rounded-md hover:bg-accent-900 transition-colors duration-300 flex items-center justify-center gap-2 text-base font-medium m-auto mb-4"
                                >
                                    Add To Cart <HiArrowUpRight />
                                </a>
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
                    <div className="p-6 space-y-4 text-sm border-b">
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
                    <div className="text-center mt-6">
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
                    </div>
                </>
            )}
        </div>
    );
};

export default CourseSidebar;
