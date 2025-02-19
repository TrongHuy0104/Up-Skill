'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

import arrowLeft from '@/public/assets/icons/home-arrow-left.svg';
import arrowRight from '@/public/assets/icons/home-arrow-right.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { layoutStyles } from '@/styles/styles';
import client1 from '@/public/assets/images/avatar/user-4.png';
import client2 from '@/public/assets/images/avatar/user-5.png';
import client3 from '@/public/assets/images/avatar/user-6.png';
import client4 from '@/public/assets/images/avatar/user-7.png';
import client5 from '@/public/assets/images/avatar/user-8.png';

const testimonials = [
    {
        id: 1,
        name: 'Nicole Wells',
        role: 'Founder',
        image: client1,
        text: 'Customization is very easy with this theme. Clean and quality design and full support for any kind of request! Great theme!'
    },
    {
        id: 2,
        name: 'Jane Doe',
        role: 'Designer',
        image: client2,
        text: 'Amazing theme! Super easy to customize and the support team is very helpful.'
    },
    {
        id: 3,
        name: 'John Smith',
        role: 'Developer',
        image: client3,
        text: "I love this design! It's clean, minimal, and professional. Great work!"
    },
    {
        id: 4,
        name: 'Emily Brown',
        role: 'Manager',
        image: client4,
        text: 'Highly recommended! The design quality is excellent.'
    },
    {
        id: 5,
        name: 'Emily Brown',
        role: 'Manager',
        image: client5,
        text: 'Highly recommended! The design quality is excellent.'
    }
];

const TestimonialCarousel = () => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <section className={`${layoutStyles.container} pb-[140px] relative`}>
            <div className={layoutStyles.row}>
                <div className="w-full">
                    <div className="mb-6 text-center text-primary-800">
                        <h2 className="mb-2 font-bold font-cardo text-4xl leading-[50px]">What Clients Are Saying</h2>
                        <p>Lorem ipsum dolor sit amet elit</p>
                    </div>
                </div>
            </div>
            <div className="w-10/12 mx-auto">
                <Slider {...settings}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-6">
                            <Image
                                src={testimonial.image}
                                width={120}
                                height={120}
                                alt={testimonial.name}
                                className="mx-auto rounded-[40px] h-[120px]"
                            />
                            <div className="mx-auto mt-8 w-[922px] flex items-center justify-center flex-col">
                                <div className="flex items-center justify-center flex-col">
                                    <Link
                                        href="#!"
                                        className="text-lg text-primary-800 cursor-pointer transition duration-300 hover:text-accent-600"
                                    >
                                        {testimonial.name}
                                    </Link>
                                    <span className="text-sm leading-7 -mt-1 mb-4">{testimonial.role}</span>
                                    <div className="flex items-center gap-2">
                                        <FaStar size={14} />
                                        <FaStar size={14} />
                                        <FaStar size={14} />
                                        <FaStar size={14} />
                                        <FaStar size={14} />
                                    </div>
                                </div>
                                <p className="mt-[18px] text-[26px] leading-[46px] font-medium text-center text-primary-800">
                                    {testimonial.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        className="absolute top-[100px] left-0 transform -translate-y-[100%] z-10 p-2 bg-transparent transition"
        onClick={onClick}
    >
        <Image src={arrowLeft} alt="" />
    </button>
);

// Custom Next Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        className="absolute top-[100px] right-0 transform -translate-y-[100%] z-10 p-2 bg-transparent transition"
        onClick={onClick}
    >
        <Image src={arrowRight} alt="" className="" />
    </button>
);

export default TestimonialCarousel;
