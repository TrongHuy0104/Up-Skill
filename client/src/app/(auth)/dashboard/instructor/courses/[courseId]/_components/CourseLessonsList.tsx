'use client';

import React, { useEffect, useState } from 'react';
import { Grip, Pencil } from 'lucide-react';
import { Draggable, Droppable, DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useReorderLessonMutation } from '@/lib/redux/features/course/courseApi';
import { toast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/custom/SpinnerMini';
import { Badge } from '@/components/ui/Badge';

type Props = {
    course: any;
    refetchCourse: any;
    onEdit: any;
    curSection: string;
    setSubActive: (active: number) => void;
};

function CourseLessonsList({ course, refetchCourse, onEdit, setSubActive, curSection }: Props) {
    const [reorderLesson, { isLoading, isSuccess, error }] = useReorderLessonMutation();
    const [isMounted, setIsMounted] = useState(false);
    const [lessons, setLessons] = useState(course.courseData.filter((c: any) => c.videoSection === curSection));

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setLessons(course.courseData.filter((c: any) => c.videoSection === curSection));
    }, [course, curSection]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const data = items.map((lesson: any) => ({
            id: lesson._id,
            order: items.findIndex((item: any) => item._id === lesson._id) + 1
        }));
        setLessons(items);
        reorderLesson({ id: course._id, data });
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
                            {lessons.map((lesson: any, index: number) => (
                                <Draggable key={lesson._id} draggableId={lesson._id} index={index}>
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
                                            {lesson.title}
                                            <div className="ml-auto pr-3 flex items-center gap-x-3">
                                                {lesson?.isFree && (
                                                    <Badge
                                                        className={`bg-slate-500 ${lesson.isFree && 'bg-accent-600 text-primary-50'}`}
                                                    >
                                                        Free
                                                    </Badge>
                                                )}
                                                <Badge
                                                    className={`bg-slate-500 ${lesson.isPublished && 'bg-green-500 text-primary-50'}`}
                                                >
                                                    {lesson.isPublished ? 'Publish' : 'Unpublish'}
                                                </Badge>
                                                <Pencil
                                                    onClick={() => {
                                                        setSubActive(2);
                                                        onEdit(lesson._id);
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

export default CourseLessonsList;
