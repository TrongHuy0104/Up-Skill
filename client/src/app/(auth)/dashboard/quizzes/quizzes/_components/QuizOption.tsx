import React from 'react';

interface QuizOptionProps {
  onEdit: () => void;
  onRemove: () => void;
}

const QuizOption: React.FC<QuizOptionProps> = ({ onEdit, onRemove }) => {
  return (
    <div className="selling-course-btn btn-style-2 flex space-x-2">
      <button
        onClick={onEdit}
        className="btn-edit btn p-2 text-gray-500 hover:text-blue-600 transition-colors"
      >
        <i className="flaticon-setting-1"></i>
      </button>
      <button
        onClick={onRemove}
        className="btn-remove btn p-2 text-gray-500 hover:text-red-600 transition-colors"
      >
        <i className="flaticon-close"></i>
      </button>
    </div>
  );
};

export default QuizOption;