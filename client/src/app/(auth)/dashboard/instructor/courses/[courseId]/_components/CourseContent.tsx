'use client';

import { formCreateCourseStyles } from '@/styles/styles';
import React, { useRef, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { HiPencilAlt } from 'react-icons/hi';
import { FiPlusCircle } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa6';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseContentData: any;
    setCourseContentData: (courseContentData: any) => void;
    handleSubmit: any;
};

function CourseContent({
    active,
    setActive,
    courseContentData,
    setCourseContentData,
    handleSubmit: handleCourseSubmit
}: Props) {
    // Group lessons into an array of sections
    const groupedSections = courseContentData.reduce((acc: any, lesson: any) => {
        const sectionName = lesson.videoSection;

        // Find if the section already exists in the accumulator
        const existingSection = acc.find((section: any) => section.sectionName === sectionName);

        if (existingSection) {
            // If the section exists, push the lesson into its lessons array
            existingSection.lessons.push(lesson);
        } else {
            // If the section doesn't exist, create a new section object
            acc.push({
                sectionName,
                lessons: [lesson]
            });
        }

        return acc;
    }, []);

    // Track collapsed state for each section
    const [isSectionCollapsed, setIsSectionCollapsed] = useState(Array(groupedSections.length).fill(false));

    // Track collapsed state for each lesson within each section
    const [isLessonCollapsed, setIsLessonCollapsed] = useState(
        groupedSections.map((section: any) => Array(section.lessons.length).fill(false))
    );

    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

    const inputSectionRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleEditClick = (index: number) => {
        setEditingSectionIndex(index);
        if (inputSectionRefs.current[index]) {
            inputSectionRefs.current[index]?.focus();
        }
    };

    const handleUpdateClick = () => {
        setEditingSectionIndex(null);
    };

    const [activeSection, setActiveSection] = useState(1);

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    // Toggle collapse for a specific section
    const handleSectionCollapseToggle = (index: number) => {
        const updatedCollapsed = [...isSectionCollapsed];
        updatedCollapsed[index] = !updatedCollapsed[index];
        setIsSectionCollapsed(updatedCollapsed);
    };

    // Toggle collapse for a specific lesson within a section
    const handleLessonCollapseToggle = (sectionIndex: number, lessonIndex: number) => {
        const updatedLessonCollapsed = [...isLessonCollapsed];
        updatedLessonCollapsed[sectionIndex][lessonIndex] = !updatedLessonCollapsed[sectionIndex][lessonIndex];
        setIsLessonCollapsed(updatedLessonCollapsed);
    };

    const handleRemoveLink = (section: any, lessonIndex: number, linkIndex: number) => {
        const updatedData = [...courseContentData];

        const sectionLessons = updatedData.filter((item: any) => item.videoSection === section.sectionName);

        const lessonToRemoveLink = sectionLessons[lessonIndex];

        const lessonIndexInData = updatedData.findIndex((item: any) => item === lessonToRemoveLink);

        if (lessonIndexInData !== -1) {
            updatedData[lessonIndexInData].links.splice(linkIndex, 1);
        }

        setCourseContentData(updatedData);
    };

    const handleAddLink = (index: number, section: any) => {
        const updatedData = [...courseContentData];

        const sectionLessons = updatedData.filter((item: any) => item.videoSection === section.sectionName);

        const lessonToAddLink = sectionLessons[index];

        const lessonIndexInData = updatedData.findIndex((item: any) => item === lessonToAddLink);

        if (lessonIndexInData !== -1) {
            updatedData[lessonIndexInData].links.push({ title: '', url: '' });
        }

        setCourseContentData(updatedData);
    };

    const newContentHandler = (item: any, sectionIndex: number) => {
        if (
            item.title === '' ||
            item.description === '' ||
            item.videoUrl === '' ||
            item.links[0].title === '' ||
            item.links[0].url === ''
        ) {
            toast({
                variant: 'destructive',
                title: 'Please fill all the previous lesson first!'
            });
        } else {
            const newContent = {
                videoUrl: '',
                title: '',
                videoSection: item.videoSection, // Use the current section's name
                links: [{ title: '', url: '' }]
            };

            // Find the index of the last lesson in the current section
            const lastLessonIndex = courseContentData.findIndex(
                (lesson: any) => lesson.videoSection === item.videoSection
            );

            // Insert the new lesson after the last lesson of the current section
            const updatedData = [...courseContentData];
            updatedData.splice(lastLessonIndex + 1, 0, newContent);
            setCourseContentData(updatedData);

            // Update isLessonCollapsed state
            setIsLessonCollapsed((prevState: any) => {
                const newState = [...prevState];
                newState[sectionIndex] = [...newState[sectionIndex], false];
                return newState;
            });
        }
    };

    const addNewSection = () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast({
                variant: 'destructive',
                title: 'Please fill all the fields first!'
            });
        } else {
            setActiveSection(activeSection + 1);
            const newContent = {
                videoUrl: '',
                title: '',
                description: '',
                videoSection: `Untitled Section ${activeSection}`,
                links: [{ title: '', url: '' }]
            };
            setCourseContentData([...courseContentData, newContent]);

            // Update isLessonCollapsed state
            setIsLessonCollapsed((prevState: any) => [...prevState, [false]]);
        }
    };

    const prevButton = () => {
        setActive(active - 1);
    };

    const handleOptions = () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast({
                variant: 'destructive',
                title: 'Section cannot be empty!'
            });
        } else {
            setActive(active + 1);
            handleCourseSubmit();
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {groupedSections?.map((section: any, sectionIndex: number) => (
                    <div
                        key={`section-${sectionIndex}`}
                        className={`w-full border border-primary-100 py-2 px-5 rounded text-primary-800 mb-4`}
                    >
                        {/* Section Header */}
                        <div
                            className={`flex w-full items-center pb-2 pt-2 ${!isSectionCollapsed[sectionIndex] && 'border-b border-primary-100'}`}
                        >
                            <IoIosArrowDown
                                size={18}
                                onClick={() => handleSectionCollapseToggle(sectionIndex)}
                                style={{
                                    transform: isSectionCollapsed[sectionIndex] ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                                className="relative cursor-pointer"
                            />
                            <input
                                type="text"
                                ref={(el) => {
                                    inputSectionRefs.current[sectionIndex] = el;
                                }}
                                className={`text-lg font-medium w-full bg-transparent pr-4 ml-1 ${
                                    editingSectionIndex === sectionIndex
                                        ? 'border-b-2 border-primary-600'
                                        : 'border-b-0'
                                }`}
                                value={section.sectionName}
                                onChange={(e) => {
                                    const updatedData = [...courseContentData];
                                    updatedData[sectionIndex].videoSection = e.target.value;
                                    setCourseContentData(updatedData);
                                }}
                            />
                            <Button
                                size="xs"
                                className="ml-4"
                                onClick={
                                    editingSectionIndex === sectionIndex
                                        ? handleUpdateClick
                                        : () => handleEditClick(sectionIndex)
                                }
                            >
                                {editingSectionIndex === sectionIndex ? (
                                    <FaCheck className="cursor-pointer" />
                                ) : (
                                    <HiPencilAlt className="cursor-pointer" />
                                )}
                            </Button>
                        </div>

                        {/* Lessons in Section */}
                        {!isSectionCollapsed[sectionIndex] && (
                            <div className="mt-4">
                                {section.lessons.map((lesson: any, lessonIndex: number) => (
                                    <div key={`lesson-${lessonIndex}`} className="mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IoIosArrowDown
                                                    size={16}
                                                    onClick={() =>
                                                        handleLessonCollapseToggle(sectionIndex, lessonIndex)
                                                    }
                                                    style={{
                                                        transform: isLessonCollapsed[sectionIndex][lessonIndex]
                                                            ? 'rotate(180deg)'
                                                            : 'rotate(0deg)'
                                                    }}
                                                    className="relative  cursor-pointer"
                                                />
                                                <h3 className="font-medium text-base">
                                                    {lesson.title
                                                        ? lessonIndex + 1 + '. ' + lesson.title
                                                        : lessonIndex + 1 + '. Untitled Video'}
                                                </h3>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="xs"
                                                className={`${lessonIndex > 0 ? 'cursor-pointer' : 'cursor-no-drop'}`}
                                                onClick={() => {
                                                    if (lessonIndex > 0) {
                                                        const updateData = [...courseContentData];

                                                        const sectionLessons = updateData.filter(
                                                            (item: any) => item.videoSection === section.sectionName
                                                        );

                                                        const lessonToRemove = sectionLessons[lessonIndex];

                                                        const indexToRemove = updateData.findIndex(
                                                            (item: any) => item === lessonToRemove
                                                        );

                                                        if (indexToRemove !== -1) {
                                                            updateData.splice(indexToRemove, 1);
                                                        }

                                                        setCourseContentData(updateData);
                                                    }
                                                }}
                                            >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </div>
                                        {!isLessonCollapsed[sectionIndex][lessonIndex] && (
                                            <div className="space-y-4">
                                                <div className="space-y-2 mt-2">
                                                    <label className={`${formCreateCourseStyles.label}`}>
                                                        Video Title
                                                    </label>
                                                    <input
                                                        className={formCreateCourseStyles.input}
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData.filter(
                                                                (item: any) => item.videoSection === section.sectionName
                                                            )[lessonIndex].title = e.target.value;
                                                            setCourseContentData(updatedData);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`${formCreateCourseStyles.label}`}>
                                                        Video URL
                                                    </label>
                                                    <input
                                                        className={formCreateCourseStyles.input}
                                                        type="text"
                                                        value={lesson.videoUrl}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData.filter(
                                                                (item: any) => item.videoSection === section.sectionName
                                                            )[lessonIndex].videoUrl = e.target.value;
                                                            setCourseContentData(updatedData);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={formCreateCourseStyles.label}>
                                                        Video Description
                                                    </label>
                                                    <textarea
                                                        rows={6}
                                                        cols={30}
                                                        className={`${formCreateCourseStyles.input} h-auto`}
                                                        value={lesson.description}
                                                        onChange={(e) => {
                                                            const updatedData = [...courseContentData];
                                                            updatedData.filter(
                                                                (item: any) => item.videoSection === section.sectionName
                                                            )[lessonIndex].description = e.target.value;
                                                            setCourseContentData(updatedData);
                                                        }}
                                                    />
                                                </div>
                                                <br />
                                                {lesson?.links.map((link: any, linkIndex: number) => (
                                                    <div key={`link-${lessonIndex}-${linkIndex}`} className="space-y-2">
                                                        <div className="w-full flex items-center justify-between">
                                                            <label className={formCreateCourseStyles.label}>
                                                                Link {linkIndex + 1}
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                {/* Add link button */}
                                                                {linkIndex === lesson.links.length - 1 && (
                                                                    <div className="inline-block">
                                                                        <Button
                                                                            size="xs"
                                                                            className="flex items-center cursor-pointer"
                                                                            onClick={() =>
                                                                                handleAddLink(lessonIndex, section)
                                                                            }
                                                                        >
                                                                            <FiPlusCircle />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                                <Button
                                                                    variant="destructive"
                                                                    size="xs"
                                                                    className={`${linkIndex === 0 ? 'cursor-no-drop' : 'cursor-pointer'} `}
                                                                    onClick={() =>
                                                                        linkIndex === 0
                                                                            ? null
                                                                            : handleRemoveLink(
                                                                                  section,
                                                                                  lessonIndex,
                                                                                  linkIndex
                                                                              )
                                                                    }
                                                                >
                                                                    <FaRegTrashAlt />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Source Code... {Link title}"
                                                            className={formCreateCourseStyles.input}
                                                            value={link.title}
                                                            onChange={(e) => {
                                                                const updatedData = [...courseContentData];
                                                                updatedData.filter(
                                                                    (item: any) =>
                                                                        item.videoSection === section.sectionName
                                                                )[lessonIndex].links[linkIndex].title = e.target.value;
                                                                setCourseContentData(updatedData);
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Source Code... {Link URL}"
                                                            value={link.url}
                                                            className={`${formCreateCourseStyles.input} mt-2`}
                                                            onChange={(e) => {
                                                                const updatedData = [...courseContentData];
                                                                updatedData.filter(
                                                                    (item: any) =>
                                                                        item.videoSection === section.sectionName
                                                                )[lessonIndex].links[linkIndex].url = e.target.value;
                                                                setCourseContentData(updatedData);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Add new content */}
                                        {lessonIndex === section.lessons.length - 1 && (
                                            <div>
                                                <Button
                                                    size="sm"
                                                    className="flex items-center cursor-pointer mt-4 px-3"
                                                    onClick={() => newContentHandler(lesson, sectionIndex)}
                                                >
                                                    <FiPlusCircle className="text-xl" />
                                                    Add Lesson
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {/* add new section */}
                <Button size="sm" className="mb-4" onClick={() => addNewSection()}>
                    <FiPlusCircle size={20} />
                    Add Section
                </Button>
            </form>
            <div className="flex justify-between">
                <Button onClick={prevButton} size="sm" type="submit">
                    <span>Back</span>
                </Button>
                <Button type="submit" size="sm" onClick={handleOptions}>
                    <span>Next</span>
                </Button>
            </div>
        </div>
    );
}

export default CourseContent;
