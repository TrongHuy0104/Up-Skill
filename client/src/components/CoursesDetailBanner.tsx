import React from 'react';
import Breadcrumb from './ui/Breadcrumb';

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
    return 'text-center';
}

export default function CoursesDetailBanner({
    title,
    breadcrumbs,
    contentAlignment = 'center',
    backgroundColor = 'bg-primary-50',
    background,
    children,
    button,
    buttonPosition = 'right'
}: BannerProps) {
    const alignmentClass = getAlignmentClass(contentAlignment);

    return (
        <div className={`page-title py-[54px] flex items-center relative text-primary-800 ${backgroundColor}`}>
            {/* Overlay hình nền */}
            {background && (
                <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url(${background})` }}
                />
            )}

            {/* Nội dung */}
            <div className="tf-container ml-0 w-[900px] relative z-10 px-[14px] ">
                <div
                    className={`flex ${buttonPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center gap-8`}
                >
                    {/* Content section */}
                    <div className={`flex-1 ${alignmentClass}`}>
                        {breadcrumbs && <Breadcrumb breadcrumbs={breadcrumbs} alignment={contentAlignment} />}
                        {title && <h2 className="text-[42px] mb-4 font-bold leading-[56px] font-cardo">{title}</h2>}
                        {children}
                    </div>

                    {/* Button section */}
                    {button && (
                        <div className={`flex-shrink-0 ${buttonPosition === 'left' ? 'order-first' : ''}`}>
                            {button}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
