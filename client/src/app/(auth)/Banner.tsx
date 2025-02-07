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

export default function Banner({
  title,
  breadcrumbs,
  contentAlignment = 'center',
  backgroundColor = 'bg-red-100',
  background,
  children,
  button,
  buttonPosition = 'right',
}: BannerProps) {
  const alignmentClass = getAlignmentClass(contentAlignment);

  return (
    <div
      className={`page-title min-h-[400px] flex items-center relative text-primary-800 ${backgroundColor}`}
    >
      {/* Overlay hình nền */}
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      {/* Nội dung */}
      <div className="tf-container mx-auto py-16 max-w-screen-xl w-full relative z-10">
        <div className={`flex ${buttonPosition === 'left' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center gap-8`}>
          {/* Content section */}
          <div className={`flex-1 ${alignmentClass}`}>
            <Breadcrumbs breadcrumbs={breadcrumbs} alignment={contentAlignment} />
            <h2 className="font-serif text-[42px] mb-4">{title}</h2>
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