import { ReactNode } from 'react';
import { DM_Sans } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import '@/styles/global.css';
import { cn } from '@/utils/helpers';
import { Toaster } from '@/components/ui/Toaster';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Providers } from './Provider';

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
                <Providers>
                    <SessionProvider>
                        <Header />
                        {children}
                        <Footer />
                    </SessionProvider>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
