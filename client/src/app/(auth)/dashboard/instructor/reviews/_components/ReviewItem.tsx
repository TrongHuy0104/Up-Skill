"use client";
import { useState } from "react";
import Image from "next/image";
import { MdOutlineStarPurple500 } from "react-icons/md";
import arrowRightIcon from '@/public/assets/icons/arrow-right.svg';
import Avatar from "@/components/ui/Avatar";

type Props = {
    readonly avatar?: string;
    readonly name?: string;
    readonly rating?: number;
    readonly date?: string;
    readonly title?: string;
    readonly content?: string;
};

export default function ReviewItem({
    avatar,
    name = "Anonymous",
    rating = 5,
    date = "2 months ago",
    title = "Excellent Course",
    content = "Lorem ipsum dolor sit amet. Qui incidunt dolores non similique ducimus et debitis molestiae. Et autem quia eum reprehenderit voluptates est reprehenderit illo est enim perferendis est neque sunt.",
}: Props) {
    const [showReply, setShowReply] = useState(false);

    return (
        <div className="flex gap-8 pb-8 pt-6 border-b border-gray-300">
            {/* Avatar */}
            <div className="flex-none">
                <Avatar size={60} avatar={avatar} />
            </div>

            {/* Review Content */}
            <div className="flex flex-col gap-1 text-primary">
                {/* Reviewer's Name */}
                <h5 className="text-lg font-medium leading-[30px]">
                    <a href="#" className="text-primary-800 hover:text-accent-600 transition-colors">
                        {name}
                    </a>
                </h5>

                {/* Star Rating */}
                <div className="ratings flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <MdOutlineStarPurple500
                            key={i}
                            className={i < rating ? "text-yellow-500" : "text-gray-300"}
                        />
                    ))}
                    <div className="text-primary-800 text-sm ml-2">{date}</div>
                </div>

                {/* Review Title */}
                <p className="text-primary-800 text-[15px] font-medium leading-[28px]">{title}</p>

                {/* Review Content */}
                <p className="text-primary-800 text-[15px] leading-[28px] pb-2">{content}</p>

                {/* Reply Button */}
                <button
                    className="px-[14px] text-sm bg-accent-100 text-primary-800 rounded-md py-1 w-fit"
                    onClick={() => setShowReply(!showReply)}
                >
                    Reply
                </button>

                {/* Reply Input Field */}
                <form
                    className={`space-comment relative mt-4 overflow-hidden transition-all duration-500 ease-in-out ${showReply ? "opacity-100 max-h-[500px] scale-100" : "opacity-0 max-h-0 scale-95"
                        }`}
                >
                    <textarea
                        rows={7}
                        className="w-full h-[150px] text-primary-800 text-sm leading-[28px] p-2.5 border border-gray-300 rounded-md resize-none appearance-none outline-none focus:outline-none transition-all duration-300"
                        placeholder="Add a Comment"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="absolute flex items-center justify-center h-[50px] w-[50px] cursor-pointer top-[23%] right-[2%] rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-110"
                    >
                        <Image src={arrowRightIcon} alt="arrow right icon" />
                    </button>
                </form>
            </div>
        </div>
    );
}