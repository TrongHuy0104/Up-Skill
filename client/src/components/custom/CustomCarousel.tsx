import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

interface Props {
    readonly component: any;
}

export function CarouselSpacing({ component }: Props) {
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
                        <div className="p-1">{component}</div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
