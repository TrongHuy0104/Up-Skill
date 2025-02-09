'use client';

import Image from 'next/image';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { LuSquareUserRound } from 'react-icons/lu';
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import { User } from '@/types/User';
import defaultAvatar from '@/public/assets/images/avatar/user-4.png';
import { signOutAction } from '@/lib/actions/auth';
import { useLogoutQuery } from '@/lib/redux/features/auth/authApi';

interface UserDropdownProps {
    user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
    const [logout, setLogout] = useState(false);
    useLogoutQuery(undefined, { skip: !logout ? true : false });
    const { data: session } = useSession();

    const logoutHandler = async () => {
        if (session) {
            await signOut();
        }
        setLogout(true);
        redirect('/');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="h-[60px] flex items-center gap-3 cursor-pointer">
                    <Image
                        className="h-8 rounded-full"
                        width={32}
                        height={32}
                        src={user.avatar.url ?? defaultAvatar}
                        alt={user.name ?? 'User Avatar'}
                        referrerPolicy="no-referrer"
                    />
                    <span className="font-medium">{user.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>
                                <LuSquareUserRound className="text-xl" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/ui">
                        <DropdownMenuItem>
                            Settings
                            <DropdownMenuShortcut>
                                <IoSettingsOutline className="text-lg" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <form action={signOutAction} className="w-full">
                        <button
                            type="submit"
                            onClick={logoutHandler}
                            className="flex w-full items-center justify-between text-left"
                        >
                            Log out
                            <DropdownMenuShortcut>
                                <IoIosLogOut className="text-xl" />
                            </DropdownMenuShortcut>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
