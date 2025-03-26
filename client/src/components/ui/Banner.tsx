import React from 'react';
import Breadcrumb from './Breadcrumb';

interface Breadcrumb {
    href?: string;
    text: string;
}

interface BannerProps {
    title?: string;
    breadcrumbs?: Breadcrumb[];
    contentAlignment?: 'center' | 'left' | 'right';
    backgroundColor?: string;
    background?: string;
    children?: React.ReactNode;
    button?: React.ReactNode;
    buttonPosition?: 'left' | 'right';
}

function getAlignmentClass(alignment: 'center' | 'left' | 'right'): string {
    if (alignment === 'left') return 'text-left';
    if (alignment === 'right') return 'text-right';
    return 'text-center';
}

export default function Banner({
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
        <div className={`py-8 sm:py-[54px] flex items-center relative text-primary-800 ${backgroundColor} w-full`}>
            {/* Background image */}
            {background && (
                <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-10"
                    style={{ backgroundImage: `url(${background})` }}
                />
            )}

            {/* Content container */}
            <div className="mx-auto w-full max-w-[1428px] relative z-10 px-4 ">
                <div
                    className={`flex ${
                        buttonPosition === 'left' ? 'flex-col-reverse' : 'flex-col'
                    } md:flex-row justify-between items-center gap-4 sm:gap-8`}
                >
                    {/* Content section */}
                    <div className={`flex-1 ${alignmentClass} w-full text-center md:text-left`}>
                        {breadcrumbs && <Breadcrumb breadcrumbs={breadcrumbs} alignment={contentAlignment} />}
                        {title && (
                            <h2 className="text-2xl sm:text-[28px] md:text-[36px] mb-3 sm:mb-4 font-bold leading-8 sm:leading-[40px] md:leading-[56px] font-cardo">
                                {title}
                            </h2>
                        )}
                        <div className="text-sm sm:text-base">{children}</div>
                    </div>

                    {/* Button section */}
                    {button && (
                        <div
                            className={`flex-shrink-0 ${
                                buttonPosition === 'left' ? 'md:order-first' : ''
                            } w-full md:w-auto mt-4 sm:mt-0`}
                        >
                            {button}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
