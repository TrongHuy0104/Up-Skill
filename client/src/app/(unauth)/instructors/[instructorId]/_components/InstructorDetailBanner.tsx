import Breadcrumb from '@/components/ui/Breadcrumb';
import React from 'react';

interface Breadcrumb {
    href?: string;
    text: string;
}

interface BannerProps {
    title?: string;
    breadcrumbs?: Breadcrumb[];
    contentAlignment?: 'center' | 'left' | 'right';
    backgroundColor?: string; // Màu nền
    background?: string; // Hình nền (URL hoặc gradient)
    children?: React.ReactNode;
    button?: React.ReactNode;
    buttonPosition?: 'left' | 'right';
}

function getAlignmentClass(alignment: 'center' | 'left' | 'right'): string {
    if (alignment === 'left') return 'text-left';
    if (alignment === 'right') return 'text-right';
    return 'text-left';
}

export default function InstructorDetailBanner({
    title,
    breadcrumbs,
    contentAlignment = 'center',
    backgroundColor = 'bg-accent-100',
    background,
    children,
    button,
    buttonPosition = 'right'
}: BannerProps) {
    const alignmentClass = getAlignmentClass(contentAlignment);

    return (
        <div className={`relative w-full overflow-hidden ${backgroundColor}`}>
            {background && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${background})` }}
                />
            )}
            <div className="mx-auto max-w-[1428px] ">
                <div className={`flex flex-col items-start ${alignmentClass} text-primary-800 py-[54px]`}>
                    {breadcrumbs && <Breadcrumb breadcrumbs={breadcrumbs} alignment={contentAlignment} />}
                    {title && <h2 className="text-[42px] mb-4 font-bold leading-[56px] font-cardo">{title}</h2>}
                    {children}
                </div>
                {button && (
                    <div className={`flex-shrink-0 ${buttonPosition === 'left' ? 'order-first' : ''}`}>{button}</div>
                )}
            </div>
        </div>
    );
}
