import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

interface Props {
    readonly component: any;
    readonly colNumber?: number;
}

export function CarouselSpacing({ component, colNumber = 5 }: Props) {
    const getColumnNumber = (itemsPerRow: number) => {
        switch (itemsPerRow) {
            case 1:
                return 'basis-full'; // 1 item per row (full width)
            case 2:
                return 'md:basis-1/2 lg:basis-1/2'; // 2 items per row
            case 3:
                return 'md:basis-1/2 lg:basis-1/3'; // 3 items per row
            case 4:
                return 'md:basis-1/2 lg:basis-1/4'; // 4 items per row
            case 5:
                return 'md:basis-1/2 lg:basis-1/5'; // 5 items per row
            default:
                return 'md:basis-1/2 lg:basis-1/5'; // Default to 2 items per row
        }
    };
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className={`pl-1 ${getColumnNumber(colNumber)}`}>
                        <div className="p-1">{component}</div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
