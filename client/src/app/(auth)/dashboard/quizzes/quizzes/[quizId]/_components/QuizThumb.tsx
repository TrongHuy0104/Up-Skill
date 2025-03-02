import React from 'react';
import Image from 'next/image';

interface QuizThumbProps {
  readonly quiz: any; // Replace `any` with your quiz interface if available
}

export default function QuizThumb({ quiz }: QuizThumbProps) {
  return (
    <div className="flex items-baseline max-w-102">
      {/* Thumbnail Image */}
      <div className="w-24 h-20 rounded-lg mr-4 overflow-hidden shadow-[10px] flex-shrink-0">
        <Image
          src={`/images/item/${quiz._id}.jpg`} // Dynamic image based on quizId
          alt={quiz.title}
          width={96} // Adjusted for better image quality
          height={80} // Adjusted for better image quality
          className="object-cover w-full h-full"
        />
      </div>

      {/* Title, Course, and Section Links */}
      <div className="flex flex-col space-y-1"> {/* Use flex-col and space-y-1 for vertical spacing */}
        {/* Quiz Title */}
        <a
          href="#"
          className="text-primary-800 hover:text-orange-500 transition-colors truncate"
          title={quiz.title} // Show full title on hover
        >
          {quiz.title}
        </a>

        {/* Course Tag */}
        <a
          href="#"
          className="text-[10px] text-gray-600 hover:text-orange-500 transition-colors truncate"
          title={quiz.courseId.tags} // Show full course tag on hover
        >
          Course: {quiz.courseId.tags}
        </a>

        {/* Section Tag */}
        <a
          href="#"
          className="text-[10px] text-gray-600 hover:text-orange-500 transition-colors truncate"
          title={quiz.videoSection} // Show full section on hover
        >
          Section: {quiz.videoSection}
        </a>
      </div>
    </div>
  );
}