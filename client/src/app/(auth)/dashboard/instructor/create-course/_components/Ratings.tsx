import React from 'react';
import { MdOutlineStarPurple500, MdOutlineStarHalf, MdOutlineStarOutline } from 'react-icons/md';

type Props = { rating: number };

function Ratings({ rating }: Props) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<MdOutlineStarPurple500 key={i} size={20} className="mr-2 cursor-pointer" />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<MdOutlineStarHalf key={i} size={20} className="mr-2 cursor-pointer" />);
        } else {
            stars.push(<MdOutlineStarOutline key={i} size={20} className="mr-2 cursor-pointer" />);
        }
    }
    return <div className="flex">{stars}</div>;
}

export default Ratings;
