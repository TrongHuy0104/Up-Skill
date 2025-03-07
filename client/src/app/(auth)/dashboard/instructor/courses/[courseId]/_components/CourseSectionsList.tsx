'use client';

import React, { useEffect, useState } from 'react';
import { Grip, Pencil } from 'lucide-react';
import { Draggable, Droppable, DragDropContext, DropResult } from '@hello-pangea/dnd';

import { useReorderSectionMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { Badge } from '@/components/ui/Badge';

type Props = {
    courseId: string;
    sections: any;
    refetchCourse: any;
    onEdit: any;
    setSubActive: (active: number) => void;
};

function CourseSectionsList({ courseId, sections: items, refetchCourse, onEdit, setSubActive }: Props) {
    const [reorderSection, { isLoading, isSuccess, error }] = useReorderSectionMutation();

    const [isMounted, setIsMounted] = useState(false);
    const [sections, setSections] = useState([
        ...new Map(items.map((item: any) => [item.videoSection, item])).values()
    ]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSections(items);

        const data = items.map((section: any) => ({
            title: section.videoSection,
            order: items.findIndex((item: any) => item._id === section._id) + 1
        }));

        reorderSection({ id: courseId, data });
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setSections([...new Map(items.map((item: any) => [item.videoSection, item])).values()]);
    }, [items]);

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
                            {sections.map((section: any, index: number) => (
                                <Draggable key={section._id} draggableId={section._id} index={index}>
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
                                            {section.videoSection}
                                            <div className="ml-auto pr-3 flex items-center gap-x-3">
                                                <Badge
                                                    className={`bg-slate-500 ${section.isPublishedSection && 'bg-accent-600 text-primary-50'}`}
                                                >
                                                    {section.isPublishedSection ? 'Published' : 'Draft'}
                                                </Badge>
                                                <Pencil
                                                    onClick={() => {
                                                        setSubActive(1);
                                                        onEdit(section.videoSection);
                                                    }}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default CourseSectionsList;
