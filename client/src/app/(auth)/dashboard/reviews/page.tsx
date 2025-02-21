"use client";

import SortBy from "./_components/SortBy";
import ReviewItem from "./_components/ReviewItem";

const reviews = [
    {
        id: 1,
        name: "Sophia Carter",
        rating: 5,
        date: "1 week ago",
        title: "Fantastic Course!",
        content: "The course was structured really well, and the instructor explained concepts clearly. Highly recommended!"
    },
    {
        id: 2,
        name: "Daniel Lee",
        rating: 4,
        date: "2 months ago",
        title: "Great for Beginners",
        content: "I learned a lot from this course. Some parts could have been more detailed, but overall a great experience."
    },
    {
        id: 3,
        name: "Jessica Adams",
        rating: 5,
        date: "3 days ago",
        title: "Very Informative",
        content: "The instructor is very knowledgeable and provides great real-world examples. Will definitely enroll in more courses!"
    },
    {
        id: 4,
        name: "Michael Brown",
        rating: 3,
        date: "1 month ago",
        title: "Decent Course",
        content: "Content is good but needs more real-life examples. The pace was a bit fast for beginners."
    },
    {
        id: 5,
        name: "Emily Johnson",
        rating: 4,
        date: "5 days ago",
        title: "Helped Me Improve",
        content: "I struggled at first, but after completing this course, I feel much more confident in my coding skills."
    }
];

export default function Page() {
    // Danh sách lựa chọn sắp xếp
    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "3_days", label: "3 days" },
    ];
    return (
        <div className="px-10 py-10 ml-auto max-w-[1000px] border-[1px] border-primary-100 rounded-xl">
            <div className="border-b flex items-center justify-between gap-5 pb-8">
                <div className="flex-grow">
                    <h6 className="text-[22px] font-medium leading-[28px]">
                        Student Reviews
                    </h6>
                </div>
                <SortBy options={sortOptions} defaultValue="Newest" />
            </div>

            {/* Nội dung Review */}
            <div className="p-2.5 rounded-xl">
                {reviews?.map((review) => (
                    <ReviewItem
                        key={review.id}
                        name={review.name}
                        rating={review.rating}
                        date={review.date}
                        title={review.title}
                        content={review.content}
                    />
                ))}
            </div>
        </div>
    );
}
