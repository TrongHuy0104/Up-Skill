  import React from 'react';
  import Breadcrumbs from './Breadcrumbs';

  interface Breadcrumb {
    href?: string;
    text: string;
  }

  interface BannerProps {
    title: string;
    breadcrumbs: Breadcrumb[];
    contentAlignment?: 'center' | 'left' | 'right';
    backgroundColor?: string;
    children?: React.ReactNode;
    button?: React.ReactNode; // Prop để truyền button
    buttonPosition?: 'left' | 'right'; // Vị trí của button
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
    backgroundColor = 'bg-red-100',
    children,
    button,
    buttonPosition = 'right', // Mặc định button nằm bên phải
  }: BannerProps) {
    const alignmentClass = getAlignmentClass(contentAlignment);

    return (
      <div className={`page-title ${backgroundColor}`}>
        <div className="tf-container mx-auto py-16 max-w-screen-xl">
          {/* Flex container để căn chỉnh children và button */}
          <div className={`flex ${buttonPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
            {/* Children content */}
            <div className={`flex-1 ${alignmentClass}`}>
              <Breadcrumbs breadcrumbs={breadcrumbs} alignment={contentAlignment} />
              <h2 className="font-serif text-[42px]">{title}</h2>
              {children}
            </div>

            {/* Button */}
            {button && <div className={`${buttonPosition === 'left' ? 'mr-8' : 'ml-8'}`}>{button}</div>}
          </div>
        </div>
      </div>
    );
  }