'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import likeIcon from '@/public/assets/icons/like-icon.svg';
import dislikeIcon from '@/public/assets/icons/dislike-icon.svg';
import starIcon from '@/public/assets/icons/star.svg';
import { formatDistanceToNow } from 'date-fns';
import FormReview from './FormReview';
import MoreSections from '@/public/assets/icons/more-sections.svg';

interface ReviewProps {
    name: string;
    rating: number;
    date: Date; // Date type
    content: string;
    isLastReview: boolean; // New prop to check if this is the last review
}

const Review: React.FC<ReviewProps> = ({ name, rating, date, content, isLastReview }) => {
    // Format the date to show relative time
    const formattedDate = formatDistanceToNow(date, { addSuffix: true });

    return (
        <div className="bg-white px-6 rounded-lg justify-start text-left col-span-1 w-[900px] leading-9">
            <div className="flex space-x-6">
                {/* Avatar column */}
                <div className="w-[46px] h-[46px] bg-primary-100 rounded-full flex items-center justify-center min-w-[46px]">
                    <span className="font-bold text-primary-900 text-2xl">{name.charAt(0)}</span>
                </div>

                {/* Review details column */}
                <div className="flex flex-col">
                    <div>
                        <p className="text-lg font-semibold text-primary-800">{name}</p>
                        <div className="flex items-center space-x-1 ">
                            <div className="pr-2 flex">
                                <p className="pr-1 flex text-primary-700">{rating}</p>
                                <Image alt="Star Icon" src={starIcon}></Image>
                            </div>
                            <p className="text-primary-800 text-sm">{formattedDate}</p>
                        </div>
                    </div>
                    <p className="text-primary-800 break-words  ">{content}</p>

                    <div className="flex space-x-2 mt-2">
                        <div className="flex gap-2">
                            <Image alt="Like Icon" src={likeIcon}></Image>
                            <span className="text-primary-600">Helpful</span>
                        </div>
                        <div className="flex gap-2">
                            <Image alt="Dislike Icon" src={dislikeIcon}></Image>
                            <span className="text-primary-600">Not Helpful</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Border line separating reviews, only shown if it's not the last review */}
            {!isLastReview && <div className="border-t border-primary-100 my-[26px]"></div>}
        </div>
    );
};

const ReviewSection: React.FC = () => {
    // Sample reviews data (using Date type for the `date`)
    const allReviews = [
        { name: 'James Miller', rating: 4.9, date: new Date('2023-10-23'), content: 'Excellent! Very thorough.' },
        { name: 'Olivia White', rating: 4.7, date: new Date('2025-01-11'), content: 'Good content, well explained.' },
        { name: 'David Kim', rating: 5, date: new Date('2023-11-08'), content: 'I learned a lot, would recommend!' },
        { name: 'Sophia Lee', rating: 4.8, date: new Date('2023-09-25'), content: 'Very well structured course.' },
        {
            name: 'Michael Green',
            rating: 4.6,
            date: new Date('2023-12-05'),
            content: 'Helpful, but could have more details.'
        },
        { name: 'Bob Johnson', rating: 4.7, date: new Date('2024-11-27'), content: 'Great experience overall.' },
        { name: 'Alice Brown', rating: 5, date: new Date('2023-11-20'), content: 'Absolutely amazing!' },
        { name: 'Jane Smith', rating: 4.5, date: new Date('2023-10-15'), content: 'Nice, but could be better.' },
        { name: 'John Doe', rating: 4.8, date: new Date('2023-10-10'), content: 'Great course, very informative!' },
        {
            name: 'Theresa Edin',
            rating: 4.9,
            date: new Date('2025-08-15'),
            content:
                'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.'
        }
    ];

    // State to control how many reviews to show
    const [visibleReviews, setVisibleReviews] = useState(2); // initially show 2 reviews

    // Function to load more reviews
    const loadMoreReviews = () => {
        setVisibleReviews(visibleReviews + 5); // load 5 more reviews
    };

    // Reverse the reviews for display (show newest first)
    const reversedReviews = allReviews.reverse();

    return (
        <div className="space-y-6 ml-0 w-[900px]   pb-8 px-[14px]">
            <div className="text-left flex justify-between w-[900px]">
                <h3 className="text-[24px] font-semibold text-primary-800">Reviews</h3>
                <div className="gap-2 flex right-0">
                    <span className="text-primary-800">4.9 course rating</span>
                    <p className="text-[10px] mt-1 text-primary-800">●</p>
                    <span className="text-primary-800">4K ratings</span>
                </div>
            </div>

            {/* Display reviews based on the visibleReviews state */}
            <div className=" w-[900px] ">
                {reversedReviews
                    .slice(0, visibleReviews) // Get the reviews to display based on `visibleReviews`
                    .map((review, index) => (
                        <Review
                            key={index}
                            name={review.name}
                            rating={review.rating}
                            date={review.date}
                            content={review.content}
                            isLastReview={index === visibleReviews - 1} // Check if it's the last review
                        />
                    ))}
            </div>

            {/* View More Reviews button styled like the image */}
            {visibleReviews < reversedReviews.length && (
                <div className="text-center">
                    <button
                        onClick={loadMoreReviews}
                        className="flex w-[900px]  justify-center items-center gap-[10px] border border-primary-800 hover:border-accent-600 rounded-lg mt-4  h-[55px]"
                    >
                        View More Reviews
                        <Image src={MoreSections} alt="more sections" />
                    </button>
                </div>
            )}
            <FormReview />
        </div>
    );
};

export default ReviewSection;
