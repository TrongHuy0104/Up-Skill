'use client';

import React, { useEffect, useState } from 'react';
import { Draggable, Droppable, DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Grip } from 'lucide-react';

import { useUpdateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';

type Props = { courseId: string; prerequisites: any; refetchCourse: any; setCoursePrerequisites: any };

function PrerequisitesList({ courseId, prerequisites: items, refetchCourse, setCoursePrerequisites }: Props) {
    const [updateCourse, { isLoading, isSuccess, error }] = useUpdateCourseMutation();
    const [isMounted, setIsMounted] = useState(false);
    const [prerequisites, setPrerequisites] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setPrerequisites(items);
    }, [items]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(prerequisites);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPrerequisites(items);

        const data = {
            prerequisites: items.map((item: any) => ({
                title: item.title
            }))
        };
        setCoursePrerequisites(
            items.map((item: any) => ({
                title: item.title
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
                <Droppable droppableId="prerequisites">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {prerequisites.map((prerequisite: any, index: number) => (
                                <Draggable key={prerequisite._id} draggableId={prerequisite._id} index={index}>
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
                                            {prerequisite.title}
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

export default PrerequisitesList;
