import Image from 'next/image';
import { ReactNode } from 'react';
import loginImg from '@/public/assets/images/page-title/login.jpg';

export default function UnAuthLayout({ children }: { children: ReactNode }) {
    return (
        <section className="py-[120px] bg-accent-100">
            <div className="relative mx-auto px-5 max-w-full w-[1280px]">
                <div className="flex flex-wrap ">
                    <div className="w-1/2">
                        <div className="flex relative w-full h-[700px]">
                            <Image src={loginImg} alt="Login" className="object-cover rounded-l-lg" />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="h-full rounded-r-lg -ml-[29px] justify-start px-[60px] pt-[137px] pb-[60px] bg-primary-50 flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
