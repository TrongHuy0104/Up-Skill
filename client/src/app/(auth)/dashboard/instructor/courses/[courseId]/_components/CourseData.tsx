import { CirclePlus, CircleX, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { useUpdateCourseMutation } from '@/lib/redux/features/course/courseApi';
import { formCreateCourseStyles } from '@/styles/styles';
import BenefitsList from './BenefitsList';
import PrerequisitesList from './PrerequisitesList';
import SpinnerMini from '@/components/custom/SpinnerMini';

type Props = {
    course: any;
    refetchCourse: any;
    active: number;
    setActive: (active: number) => void;
};

function CourseData({ course, active, setActive, refetchCourse }: Props) {
    const [updateCourse, { isLoading, isSuccess, error }] = useUpdateCourseMutation();

    // states
    const [benefits, setBenefits] = useState(
        course.benefits.length > 0 ? course.benefits.map((benefit: any) => ({ title: benefit.title })) : [{ title: '' }]
    );
    const [prerequisites, setPrerequisites] = useState(
        course.prerequisites.length > 0
            ? course.prerequisites.map((prerequisite: any) => ({ title: prerequisite.title }))
            : [{ title: '' }]
    );
    const [isEditingBenefits, setIsEditingBenefits] = useState(false);
    const [isEditingPrerequisites, setIsEditingPrerequisites] = useState(false);

    // compute states
    const initialValues = {
        benefits: course.benefits.map((benefit: any) => ({ title: benefit.title })) || '',
        prerequisites: course.prerequisites.map((prerequisite: any) => ({ title: prerequisite.title })) || ''
    };
    const hasChanged = JSON.stringify({ benefits, prerequisites }) !== JSON.stringify(initialValues);
    const isCourseOptionsValid = course.benefits.length > 0 && course.prerequisites.length > 0;

    // functions
    const handleBenefitChange = (index: number, value: string) => {
        const updateBenefits = [...benefits];
        updateBenefits[index].title = value;
        setBenefits(updateBenefits);
    };

    const handleAddBenefit = () => {
        if (benefits.find((benefit: any) => benefit.title === '')) {
            toast({
                variant: 'destructive',
                title: 'Please fill the empty benefit!'
            });
        } else {
            setBenefits([...benefits, { title: '' }]);
        }
    };

    const handleRemoveBenefit = (index: number) => {
        const filterBenefits = benefits.filter((benefit: any, i: number) => i !== index);
        if (filterBenefits.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Benefit is required!'
            });
        } else {
            setBenefits(filterBenefits);
        }
    };

    const handlePrerequisitesChange = (index: number, value: string) => {
        const updatePrerequisites = [...prerequisites];
        updatePrerequisites[index].title = value;
        setPrerequisites(updatePrerequisites);
    };

    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: '' }]);
    };

    const handleRemovePrerequisite = (index: number) => {
        const filterPrerequisites = prerequisites.filter((prerequisite: any, i: number) => i !== index);
        if (filterPrerequisites.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Prerequisite is required!'
            });
        } else {
            setPrerequisites(filterPrerequisites);
        }
    };

    const handleOptions = () => {
        if (!hasChanged) return;

        if (benefits[benefits.length - 1]?.title !== '' && prerequisites[prerequisites.length - 1]?.title !== '') {
            const data = {
                benefits,
                prerequisites
            };
            updateCourse({ id: course._id, data }).unwrap();
        } else {
            toast({
                variant: 'destructive',
                title: 'Please fill the fields for go to next!'
            });
        }
    };

    const prevButton = () => {
        setActive(active - 1);
    };

    // effect
    useEffect(() => {
        if (isSuccess) {
            toast({
                variant: 'success',
                title: 'Course information update successfully'
            });
            refetchCourse();
            setIsEditingBenefits(false);
            setIsEditingPrerequisites(false);
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
    }, [isSuccess, error, isLoading, refetchCourse, active, setActive]);

    return (
        <div className="space-y-8">
            {/* Course Benefits */}
            <div className="grid grid-cols-1 mt-8 relative">
                <div className="border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                        <span>
                            Course benefits <span className="text-red-600">*</span>
                        </span>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                setIsEditingBenefits((current) => !current);
                                if (!isEditingBenefits) {
                                    setBenefits(
                                        course.benefits.length > 0
                                            ? course.benefits.map((benefit: any) => ({ title: benefit.title }))
                                            : [{ title: '' }]
                                    );
                                }
                            }}
                            size={'xs'}
                            variant="ghost"
                        >
                            {isEditingBenefits ? (
                                <span>Cancel</span>
                            ) : (
                                !isEditingBenefits && (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Edit benefits
                                    </>
                                )
                            )}
                        </Button>
                    </div>
                    {!isEditingBenefits && (
                        <div className={`text-sm mt-2 ${course.benefits.length === 0 && 'text-slate-500 italic'}`}>
                            {course.benefits.length !== 0 ? (
                                <div>
                                    <BenefitsList
                                        courseId={course?._id}
                                        benefits={course.benefits}
                                        setCourseBenefits={setBenefits}
                                        refetchCourse={refetchCourse}
                                    />
                                </div>
                            ) : (
                                'No benefit'
                            )}
                        </div>
                    )}
                    {isEditingBenefits && (
                        <div>
                            {benefits.map((benefit: any, index: number) => (
                                <div className="relative" key={`${index} ${benefit}`}>
                                    <input
                                        className={`${formCreateCourseStyles.input} mt-2 pr-8`}
                                        type="text"
                                        name="benefit"
                                        value={benefit.title}
                                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                                        placeholder="Enter course benefit..."
                                    ></input>
                                    <CircleX
                                        onClick={() => handleRemoveBenefit(index)}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 text-slate-600 cursor-pointer hover:text-accent-900 transition-colors"
                                    />
                                </div>
                            ))}
                            <Button
                                size="rounded"
                                className="mt-[10px] cursor-pointer w-[30px] py-3 px-5"
                                onClick={handleAddBenefit}
                            >
                                <CirclePlus />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {/* Course Prerequisites */}
            <div className="grid grid-cols-1 mt-2 relative">
                <div className="border bg-slate-100 rounded-md p-4">
                    <div className="font-medium flex items-center justify-between">
                        <span>
                            Course prerequisites <span className="text-red-600">*</span>
                        </span>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                setIsEditingPrerequisites((current) => !current);
                                if (!isEditingPrerequisites) {
                                    setPrerequisites(
                                        course.prerequisites.length > 0
                                            ? course.prerequisites.map((prerequisite: any) => ({
                                                  title: prerequisite.title
                                              }))
                                            : [{ title: '' }]
                                    );
                                }
                            }}
                            size={'xs'}
                            variant="ghost"
                        >
                            {isEditingPrerequisites ? (
                                <span>Cancel</span>
                            ) : (
                                !isEditingPrerequisites && (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Edit prerequisites
                                    </>
                                )
                            )}
                        </Button>
                    </div>
                    {!isEditingPrerequisites && (
                        <div className={`text-sm mt-2 ${course.prerequisites.length === 0 && 'text-slate-500 italic'}`}>
                            {course.prerequisites.length !== 0 ? (
                                <div>
                                    <PrerequisitesList
                                        courseId={course?._id}
                                        prerequisites={course.prerequisites}
                                        refetchCourse={refetchCourse}
                                        setCoursePrerequisites={setPrerequisites}
                                    />
                                </div>
                            ) : (
                                'No prerequisite'
                            )}
                        </div>
                    )}
                    {isEditingPrerequisites && (
                        <div>
                            {prerequisites.map((prerequisite: any, index: number) => (
                                <div className="relative" key={`${index} ${prerequisite}`}>
                                    <input
                                        className={`${formCreateCourseStyles.input} mt-2 pr-8`}
                                        type="text"
                                        name="prerequisite"
                                        value={prerequisite.title}
                                        onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                                        placeholder="Enter course prerequisite..."
                                    ></input>
                                    <CircleX
                                        onClick={() => handleRemovePrerequisite(index)}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 text-slate-600 cursor-pointer hover:text-accent-900 transition-colors"
                                    />
                                </div>
                            ))}
                            <Button
                                size="rounded"
                                className="mt-[10px] cursor-pointer w-[30px] py-3 px-5"
                                onClick={handleAddPrerequisites}
                            >
                                <CirclePlus />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between">
                <Button onClick={prevButton} disabled={isLoading}>
                    <span>Back</span>
                </Button>
                <div className="flex items-center">
                    <Button type="submit" onClick={() => handleOptions()} disabled={!hasChanged || isLoading}>
                        {isLoading && <SpinnerMini />}
                        <span>Save</span>
                    </Button>
                    <Button
                        onClick={() => setActive(active + 1)}
                        disabled={isLoading || !isCourseOptionsValid}
                        className="ml-3"
                    >
                        <span>Next</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CourseData;
