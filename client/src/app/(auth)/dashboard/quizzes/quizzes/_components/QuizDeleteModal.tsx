import React from 'react';
import { MdOutlineDelete } from 'react-icons/md';

interface QuizDeleteModalProps {
    quizId: string;
    onClose: () => void;
    onDelete: (quizId: string) => void; // Function to handle delete action
}

const QuizDeleteModal: React.FC<QuizDeleteModalProps> = ({ quizId, onClose, onDelete }) => {

    const handleDelete = () => {
        onDelete(quizId); // Call the onDelete prop to delete the quiz
        onClose(); // Close the modal
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Delete Quiz</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="text-center mb-6">
                    <p className="text-gray-700">
                        Are you sure you want to delete this quiz? This action cannot be undone.
                    </p>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                        <MdOutlineDelete />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizDeleteModal;
