'use client';

import React, { useEffect, useState } from 'react';
import { Grip } from 'lucide-react';
import { Draggable, Droppable, DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useUpdateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';

type Props = { courseId: string; benefits: any; setCourseBenefits: any; refetchCourse: any };

function BenefitsList({ courseId, benefits: items, refetchCourse, setCourseBenefits }: Props) {
    const [updateCourse, { isLoading, isSuccess, error }] = useUpdateCourseMutation();
    const [isMounted, setIsMounted] = useState(false);
    const [benefits, setBenefits] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setBenefits(items);
    }, [items]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(benefits);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // const startIndex = Math.min(result.source.index, result.destination.index);
        // const endIndex = Math.max(result.source.index, result.destination.index);

        // const updatedBenefits = items.slice(startIndex, endIndex + 1);

        setBenefits(items);

        const data = {
            benefits: items.map((benefit: any) => ({
                title: benefit.title
            }))
        };
        setCourseBenefits(
            items.map((benefit: any) => ({
                title: benefit.title
            }))
        );
        updateCourse({ id: courseId, data }).unwrap();
    };

    useEffect(() => {
        if (isSuccess) {
            refetchCourse();
        }
        if (error) {
            if ('data' in error) {
                const errorData = error as any;
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: errorData.data.message
                });
            }
        }
    }, [isSuccess, error, refetchCourse]);

    if (!isMounted) return null;

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary-300 opacity-10">
                    <SpinnerMini />
                </div>
            )}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="benefits">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {benefits.map((benefit: any, index: number) => (
                                <Draggable key={benefit._id} draggableId={benefit._id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-primary-800 rounded-md mb-4 text-sm"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div
                                                className="px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className="h-5 w-5" />
                                            </div>
                                            {benefit.title}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default BenefitsList;
