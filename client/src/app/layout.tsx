import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import '@/styles/global.css';
import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'UpSkill',
    description: 'Education online learning system',
    openGraph: {
        type: 'website',
        locale: 'en_US'
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(dmSans.className, 'overflow-x-hidden relative')}>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
