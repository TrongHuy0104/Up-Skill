import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/assets/images/logo/logo.svg';

export default function Logo() {
    return (
        <div>
            <Link href="/">
                <Image src={logo} alt="Logo" />
            </Link>
        </div>
    );
}
