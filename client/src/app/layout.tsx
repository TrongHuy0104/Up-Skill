import { ReactNode } from 'react';
import { DM_Sans, Cardo } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import '@/styles/global.css';
import { cn } from '@/utils/helpers';
import { Toaster } from '@/components/ui/Toaster';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import { Providers } from './Provider';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmSans' });
const cardo = Cardo({ subsets: ['latin'], variable: '--font-cardo', weight: ['400', '700'] });

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
        <html lang="en" className="font-dmSans">
            <body className={cn(cardo.variable, dmSans.variable, 'overflow-x-hidden relative')}>
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
