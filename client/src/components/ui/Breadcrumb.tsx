import { IoHomeOutline } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

interface Breadcrumb {
    href?: string;
    text: string;
}

interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
    alignment?: 'left' | 'center' | 'right';
}

export default function Breadcrumb({ breadcrumbs, alignment = 'center' }: BreadcrumbsProps) {
    const getJustifyClass = (align: 'left' | 'center' | 'right'): string => {
        if (align === 'left') return 'justify-start';
        if (align === 'right') return 'justify-end';
        return 'justify-center';
    };

    const justifyClass = getJustifyClass(alignment);

    return (
        <ul className={`breadcrumbs text-sm flex items-center ${justifyClass} gap-[10px] mb-8 text-primary-800`}>
            {breadcrumbs?.map((item, index) => (
                <li key={item.text || item.href || index.toString()} className="flex items-center">
                    {index === 0 ? (
                        <Link
                            href={item.href || '#'}
                            className="flex items-center text-primary-800 hover:text-orange-500 transition-all duration-300 ease-in-out"
                        >
                            <IoHomeOutline className="mb-0.5 w-5" /> {/* Icon home */}
                        </Link>
                    ) : (
                        <>
                            <IoIosArrowForward className="mr-3 w-3 text-primary-800" />
                            {item.href && index !== breadcrumbs.length - 1 ? (
                                <Link
                                    href={item.href}
                                    className="flex text-primary-800 hover:text-orange-500 transition-all duration-300 ease-in-out"
                                >
                                    {item.text}
                                </Link>
                            ) : (
                                <span className="text-primary-800 ">{item.text}</span>
                            )}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}
