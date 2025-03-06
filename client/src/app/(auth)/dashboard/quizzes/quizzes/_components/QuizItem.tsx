import React, { useState } from 'react';
import QuizThumb from './QuizThumb';
import { RiSettingsLine, RiEyeLine } from 'react-icons/ri'; // Added RiEyeLine for the results button
import { MdOutlineDelete } from 'react-icons/md';
import { BsClockHistory } from 'react-icons/bs';
import { GoQuestion } from 'react-icons/go';
import { GrScorecard } from 'react-icons/gr';
import QuizResultModal from './QuizResultModal';
import QuizUpdateModal from './QuizUpdateModal'; // Import the update modal
import QuizDeleteModal from './QuizDeleteModal'; // Import the delete modal

interface QuizItemProps {
    readonly quiz: any;
    readonly isFirst?: boolean;
    readonly isLast?: boolean;
    readonly onClick: () => void;
    readonly userId: string; // Add userId to props
    readonly onUpdate: (updatedQuiz: any) => void; // Callback to handle quiz updates
    readonly onDelete: (quizId: string) => void; // Callback to handle quiz delete
}

export default function QuizItem({ quiz, isFirst, isLast, onClick, userId, onUpdate, onDelete }: QuizItemProps) {
    const { questions, duration, passingScore, _id: quizId } = quiz;
    const [showResultsModal, setShowResultsModal] = useState(false); // State to control results modal visibility
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State to control update modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control delete modal visibility

    return (
        <>
            <div
                role="button"
                onClick={onClick}
                className={`group grid grid-cols-10 gap-4 items-baseline cursor-pointer hover:bg-gray-100 transition ${isFirst ? 'pt-6' : ''
                    } ${isLast ? 'border-none' : 'border-b border-gray-200'} my-4 py-4`}
                aria-label="Quiz item"
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

                {/* Edit, View Results, and Remove Buttons (1 part) */}
                <div className="col-span-1 flex items-center justify-end space-x-2">
                    {/* View Results Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            setShowResultsModal(true); // Show the results modal
                        }}
                        className="btn-results btn p-2 text-primary-800 hover:text-blue-500 transition-colors"
                    >
                        <RiEyeLine />
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            setShowUpdateModal(true); // Show the update modal
                        }}
                        className="btn-edit btn p-2 text-primary-800 hover:text-orange-500 transition-colors"
                    >
                        <RiSettingsLine />
                    </button>

                    {/* Remove Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            setShowDeleteModal(true); // Show the delete confirmation modal
                        }}
                        className="btn-remove btn p-2 text-primary-800 hover:text-red-500 transition-colors"
                    >
                        <MdOutlineDelete />
                    </button>
                </div>
            </div>

            {/* Result Modal */}
            {showResultsModal && (
                <QuizResultModal
                    quizId={quizId}
                    userId={userId}
                    onClose={() => setShowResultsModal(false)} // Close the modal
                />
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <QuizUpdateModal
                    quiz={quiz}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={(updatedQuiz) => {
                        onUpdate(updatedQuiz); // Notify parent component of the update
                        setShowUpdateModal(false); // Close the modal
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <QuizDeleteModal
                    quizId={quizId}
                    onClose={() => setShowDeleteModal(false)} // Close the modal
                    onDelete={onDelete} // Trigger delete action
                />
            )}
        </>
    );
}
