import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

interface Props {
    component: any;
    colNumber: number;
}

export function CarouselSpacing({ component, colNumber }: Props) {
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className={`pl-1 md:basis-1/2 lg:basis-1/${colNumber}`}>
                        <div className="p-1">{component}</div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
