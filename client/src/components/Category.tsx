import Image from 'next/image';
import Link from 'next/link';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

export default function Category() {
    return (
        <div className="group relative flex items-center justify-center gap-[10px] px-5 py-[10px] hover:bg-accent-100 cursor-pointer rounded">
            <span className="font-medium text-[15px]">Categories</span>
            <Image src={arrowDownIcon} alt="Arrow Down Icon" />
            <div className="absolute top-0 left-0 right-0 h-[66px]" />
            <ul
                className="absolute left-0 top-full min-w-[330px] rounded bg-primary-50 border border-primary-100 opacity-0 invisible pointer-events-none translate-y-[18px] 
                transition ease-linear delay-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-[10px] group-hover:pointer-events-auto"
            >
                <li className="h-[60px] leading-[60px] line pt-2 text-sm font-medium px-5 cursor-default">
                    COURSE CATEGORIES
                </li>
                <li>
                    <Link
                        href="/"
                        className="group/item relative flex justify-start items-center h-[51px] px-5 text-base font-medium 
                        hover:bg-accent-100 hover:text-accent-900 transition ease-linear"
                    >
                        <span
                            className="absolute left-[-1px] bottom-0 top-auto w-[2px] bg-accent-900 transition-all h-0 ease-linear
                        group-hover/item:h-full group-hover/item:top-0 group-hover/item:bottom-0"
                        />
                        Graphics & Designs
                    </Link>
                </li>
            </ul>
        </div>
    );
}
