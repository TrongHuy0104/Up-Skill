import { Cardo } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

import { cn } from '@/utils/helpers';
import FormControl from '@/components/ui/FormControl';
import { Button } from '@/components/ui/Button';
import arrowTopRightIcon from '@/public/assets/icons/arrow-top-right.svg';
import { signInAction } from '@/lib/actions/auth';

const cardo = Cardo({
    subsets: ['latin'],
    weight: ['400', '700']
});

export default function Page() {
    return (
        <>
            <h2 className={cn(cardo.className, 'pb-2 font-bold text-[36px] leading-[50px] text-primary-800')}>
                Sign In To Your Account
            </h2>
            <div className="pb-5 flex gap-[5px]">
                <p className="font-medium leading-7">Don’t have an account?</p>
                <Link href="#/" className="font-medium leading-7 text-accent-900">
                    Join here
                </Link>
            </div>
            <form action="" className="flex flex-col mb-5">
                <FormControl placeholder="Username Or Email" />
                <FormControl placeholder="Password" type="password" />
                <div className="mb-6 flex items-center justify-end">
                    <Link href="#!" className="font-medium leading-7 text-accent-900 -mt-1">
                        Forgot your password?
                    </Link>
                </div>
                <Button>
                    Log In <Image src={arrowTopRightIcon} alt="" />
                </Button>
            </form>
            <form action={signInAction}>
                <Button variant="outline" className="mt-4 w-full">
                    <FcGoogle />
                    Google
                </Button>
            </form>
        </>
    );
}
