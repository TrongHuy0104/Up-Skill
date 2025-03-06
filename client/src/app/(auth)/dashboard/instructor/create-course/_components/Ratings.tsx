import React from 'react';
import { MdOutlineStarPurple500, MdOutlineStarHalf, MdOutlineStarOutline } from 'react-icons/md';

type Props = { rating: number; style?: any };

function Ratings({ rating, style }: Props) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(
                <MdOutlineStarPurple500
                    key={i}
                    color="#f0b510"
                    size={20}
                    className={`mr-2 cursor-pointer`}
                    style={style}
                />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <MdOutlineStarHalf key={i} color="#f0b510" size={20} className={`mr-2 cursor-pointer`} style={style} />
            );
        } else {
            stars.push(
                <MdOutlineStarOutline
                    key={i}
                    color="#f0b510"
                    size={20}
                    className={`mr-2 cursor-pointer`}
                    style={style}
                />
            );
        }
    }
    return <div className="flex">{stars}</div>;
}

export default Ratings;
