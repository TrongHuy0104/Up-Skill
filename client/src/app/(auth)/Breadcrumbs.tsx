import { IoHomeOutline } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';

interface Breadcrumb {
  href?: string;
  text: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  alignment?: 'left' | 'center' | 'right';
}

export default function Breadcrumbs({ breadcrumbs, alignment = 'center' }: BreadcrumbsProps) {
    const getJustifyClass = (align: 'left' | 'center' | 'right'): string => {
        if (align === 'left') return 'justify-start';
        if (align === 'right') return 'justify-end';
        return 'justify-center';
    };

    const justifyClass = getJustifyClass(alignment);

    return (
        <ul className={`breadcrumbs flex items-center ${justifyClass} gap-4 mb-8 text-gray-600`}>
            {breadcrumbs.map((item, index) => (
                <li key={item.text || item.href || index.toString()} className="flex items-center">
                    {index === 0 ? (
                        <a href={item.href || '#'} className="flex items-center text-gray-800 hover:text-orange-500">
                            <IoHomeOutline className="mr-2" /> {/* Icon home */}
                            {item.text}
                        </a>
                    ) : (
                        <>
                            <IoIosArrowForward className="mx-1 text-gray-500" /> 
                            {item.href ? (
                                <a href={item.href} className="flex items-center text-gray-800 hover:text-orange-500">
                                    {item.text}
                                </a>
                            ) : (
                                <span>{item.text}</span>
                            )}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}