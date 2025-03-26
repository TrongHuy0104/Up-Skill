'use client';

import * as React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Dùng biểu tượng mũi tên trái phải nếu muốn

// Replace with the actual paths for the images of the users
import Image1 from '@/public/assets/images/avatar/user-4.png';
import Image2 from '@/public/assets/images/avatar/user-5.png';
import Image3 from '@/public/assets/images/avatar/user-6.png';
import Image4 from '@/public/assets/images/avatar/user-8.png';
import Image5 from '@/public/assets/images/avatar/user-7.png';
import Image from 'next/image';

export default function TestimonialCarousel() {
    return (
        <section className="py-16 bg-white text-center mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold font-cardo text-primary-800 mb-4">What Clients Are Saying</h2>
            <p className="text-[15px] text-primary-600 mb-8">Lorem ipsum dolor sit amet elit.</p>

            {/* Carousel Component */}
            <Carousel
                opts={{
                    align: 'start',
                    loop: true // Thêm chế độ lặp lại
                }}
                className="w-full mx-auto relative"
            >
                <CarouselContent className="">
                    {/* Slide 1 */}
                    <CarouselItem className="basis-1/3 flex justify-center items-center mx-auto w-full">
                        <div className="w-full mx-auto">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={Image1} // Thay đường dẫn ảnh của bạn
                                    alt="Client Image"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-lg font-medium text-primary-800 mb-2">Nicole Wells</p>
                            <p className="text-sm text-primary-600">Founder</p>
                            <p className="text-2xl text-primary-800 mt-4 text-center">
                                Customization is very easy with this theme. Clean and quality design and full support
                                for any kind of request! Great theme!
                            </p>
                        </div>
                    </CarouselItem>

                    {/* Slide 2 */}
                    <CarouselItem className="basis-1/3 flex justify-center items-center">
                        <div className="max-w-sm mx-auto">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={Image2} // Thay đường dẫn ảnh của bạn
                                    alt="Client Image"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-lg font-medium text-primary-800 mb-2">John Doe</p>
                            <p className="text-sm text-primary-600">CEO</p>
                            <p className="text-2xl text-primary-800 mt-4 text-center">
                                Amazing theme and super helpful support. Highly recommended for my business needs.
                            </p>
                        </div>
                    </CarouselItem>

                    {/* Slide 3 */}
                    <CarouselItem className="basis-1/3 flex justify-center items-center">
                        <div className="max-w-sm mx-auto">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={Image3} // Thay đường dẫn ảnh của bạn
                                    alt="Client Image"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-lg font-medium text-primary-800 mb-2">Sarah Lee</p>{' '}
                            {/* Increased font size */}
                            <p className="text-sm text-primary-600">Marketing Director</p>
                            <p className="text-2xl text-primary-800 mt-4 text-center">
                                {' '}
                                {/* Increased font size */}
                                Love this theme! The features are top-notch and the customer service is fantastic!
                            </p>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/3 flex justify-center items-center">
                        <div className="max-w-sm mx-auto">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={Image4} // Thay đường dẫn ảnh của bạn
                                    alt="Client Image"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-lg font-medium text-primary-800 mb-2">Sarah Lee</p>{' '}
                            {/* Increased font size */}
                            <p className="text-sm text-primary-600">Marketing Director</p>
                            <p className="text-2xl text-primary-800 mt-4 text-center">
                                {' '}
                                {/* Increased font size */}
                                Love this theme! The features are top-notch and the customer service is fantastic!
                            </p>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/3 flex justify-center items-center">
                        <div className="max-w-sm mx-auto">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src={Image5} // Thay đường dẫn ảnh của bạn
                                    alt="Client Image"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <p className="text-lg font-medium text-primary-800 mb-2">Sarah Lee</p>{' '}
                            {/* Increased font size */}
                            <p className="text-sm text-primary-600">Marketing Director</p>
                            <p className="text-2xl text-primary-800 mt-4 text-center">
                                {' '}
                                {/* Increased font size */}
                                Love this theme! The features are top-notch and the customer service is fantastic!
                            </p>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                {/* Arrow buttons */}
                <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-6xl bg-black rounded-full p-3 z-10">
                    <FaArrowLeft />
                </CarouselPrevious>
                <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-6xl bg-black rounded-full p-3 z-10">
                    <FaArrowRight />
                </CarouselNext>
            </Carousel>
        </section>
    );
}
