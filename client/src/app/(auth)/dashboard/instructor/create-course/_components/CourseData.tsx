import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { formCreateCourseStyles } from '@/styles/styles';
import { CirclePlus } from 'lucide-react';

import React from 'react';

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
};

function CourseData({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }: Props) {
    const handleBenefitChange = (index: number, value: string) => {
        const updateBenefits = [...benefits];
        updateBenefits[index].title = value;
        setBenefits(updateBenefits);
    };

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: '' }]);
    };

    const handlePrerequisitesChange = (index: number, value: string) => {
        const updatePrerequisites = [...prerequisites];
        updatePrerequisites[index].title = value;
        setPrerequisites(updatePrerequisites);
    };

    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: '' }]);
    };

    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== '' && prerequisites[prerequisites.length - 1]?.title !== '') {
            setActive(active + 1);
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

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <label className={formCreateCourseStyles.label}>
                    What are the benefits for students in this course?
                </label>
                <br />
                {benefits.map((benefit: any, index: number) => (
                    <input
                        className={formCreateCourseStyles.input}
                        type="text"
                        key={`${index} ${benefit}`}
                        name="benefit"
                        value={benefit.title}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                        placeholder="Enter course benefit..."
                    />
                ))}
                <Button
                    size="rounded"
                    className="mt-[10px] cursor-pointer w-[30px] py-3 px-5"
                    onClick={handleAddBenefit}
                >
                    <CirclePlus />
                </Button>
            </div>
            <div className="space-y-2">
                <label className={formCreateCourseStyles.label}>
                    What are the prerequisites for starting this course?
                </label>
                <br />
                {prerequisites.map((prerequisite: any, index: number) => (
                    <input
                        className={formCreateCourseStyles.input}
                        type="text"
                        key={`${index} ${prerequisite}`}
                        name="prerequisite"
                        value={prerequisite.title}
                        onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                        placeholder="Enter course prerequisite..."
                    />
                ))}
                <Button
                    size="rounded"
                    className="mt-[10px] cursor-pointer w-[30px] py-3 px-5"
                    onClick={handleAddPrerequisites}
                >
                    <CirclePlus />
                </Button>
            </div>
            <div className="flex justify-between">
                <Button size="sm" onClick={prevButton}>
                    <span>Back</span>
                </Button>
                <Button size="sm" type="submit" onClick={() => handleOptions()}>
                    <span>Next</span>
                </Button>
            </div>
        </div>
    );
}

export default CourseData;
