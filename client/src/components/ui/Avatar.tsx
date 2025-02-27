'use client';

import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

import defaultAvatar from '@/public/assets/images/avatar/user-4.png';

type Props = {
    size: number;
    avatar?: any;
};

const Avatar = ({ size, avatar }: Props) => {
    const { user } = useSelector((state: any) => state.auth);
    return (
        <div
            className="relative flex items-center justify-center p-[2px] bg-gradient-to-br from-[hsl(308,98%,60%)] to-[hsl(25,100%,55%)] rounded-full"
            style={{ width: size + 'px', height: size + 'px' }}
        >
            <Image
                src={user?.avatar?.url || avatar || defaultAvatar}
                alt="Avatar"
                width={size}
                height={size}
                quality={100}
                className="w-full h-full rounded-full border-primary-50 bg-primary-50 object-cover"
                style={{ borderWidth: size / 14 + 'px' }}
            />
        </div>
    );
};

export default Avatar;
