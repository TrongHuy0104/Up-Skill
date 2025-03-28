'use client';
import React, { useState } from 'react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import Arrow from '@/public/assets/icons/arrow-top-right.svg';
import Image from 'next/image';
import IntroduceForm from '@/app/(auth)/dashboard/_components/IntroduceForm';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function FirstBanner() {
    const [showForm, setShowForm] = useState(false);
    const { user } = useSelector((state: any) => state.auth);

    const handleUpgradeRole = async () => {
        if (user?.role === 'instructor') {
            alert('You are already becoming an instructor');
            return;
        }
        setShowForm(true);
    };

    return (
        <>
            <Banner
                title="Become An Instructor"
                breadcrumbs={[{ href: '/', text: 'Home' }, { href: '/pages', text: 'Pages' }, { text: 'Instructor' }]}
                contentAlignment="center"
                backgroundColor="bg-accent-100"
            >
                {user?.role === 'instructor' ? (
                    <p className="text-[16px] mb-8 text-primary-800 text-center">You are already an instructor</p>
                ) : (
                    <p className="text-[16px] mb-8 text-primary-800 text-center">
                        Become an instructor and change lives — including your own
                    </p>
                )}

                <div className="flex justify-center">
                    {user?.role === 'user' ? (
                        <Button
                            className="bg-primary-800 text-white px-6 py-3 w-44 h-14 text-[16px] flex items-center gap-2 justify-center"
                            onClick={handleUpgradeRole}
                        >
                            Get Started
                            <Image src={Arrow} alt="Arrow Icon" />
                        </Button>
                    ) : (
                        <Link href="/dashboard/instructor" passHref>
                            <Button className="bg-primary-800 text-white px-6 py-3 w-44 h-14 text-[16px] flex items-center gap-2 justify-center">
                                Go to Dashboard
                                <Image src={Arrow} alt="Arrow Icon" />
                            </Button>
                        </Link>
                    )}
                </div>
            </Banner>
            {showForm && <IntroduceForm onClose={() => setShowForm(false)} />}
        </>
    );
}
