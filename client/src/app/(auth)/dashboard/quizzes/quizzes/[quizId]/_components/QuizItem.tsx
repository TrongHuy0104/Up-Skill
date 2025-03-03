import React from 'react';
import QuizThumb from './QuizThumb';
import { RiSettingsLine } from 'react-icons/ri';
import { MdOutlineDelete } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';
import { GoQuestion } from 'react-icons/go';
import { GrScorecard } from 'react-icons/gr';

interface QuizItemProps {
    readonly quiz: any;
    isFirst?: boolean;
    isLast?: boolean;
    onClick: () => void; // Thêm sự kiện onClick
}

export default function QuizItem({ quiz, isFirst, isLast, onClick }: QuizItemProps) {
    const { questions, duration, passingScore } = quiz;

    return (
        <li
            onClick={onClick} // Khi bấm vào item, gọi onClick
            className={`group grid grid-cols-10 gap-4 items-baseline cursor-pointer hover:bg-gray-100 transition ${
                isFirst ? 'pt-6' : ''
            } ${isLast ? 'border-none' : 'border-b border-gray-200'} my-4 py-4`}
        >
            {/* Quiz Thumbnail and Title (4 parts) */}
            <div className="col-span-4 flex min-w-0">
                <QuizThumb quiz={quiz} />
            </div>

            {/* Quiz Metadata (5 parts) */}
            <div className="col-span-5 flex items-center">
                <div className="grid grid-cols-3 gap-4 md:flex md:items-center md:justify-start md:gap-6">
                    <div className="flex items-center space-x-2">
                        <GoQuestion />
                        <p className="text-sm text-primary-800">{questions.length} Questions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BsClockHistory />
                        <p className="text-sm text-primary-800">{duration} Minutes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <GrScorecard />
                        <p className="text-sm text-primary-800">{passingScore}% to Pass</p>
                    </div>
                </div>
            </div>

            {/* Edit and Remove Buttons (1 part) */}
            <div className="col-span-1 flex items-center justify-end">
                <button className="btn-edit btn p-2 text-primary-800 hover:text-orange-500 transition-colors">
                    <RiSettingsLine />
                </button>
                <button className="btn-remove btn p-2 text-primary-800 hover:text-orange-500 transition-colors">
                    <MdOutlineDelete />
                </button>
            </div>
        </li>
    );
}
