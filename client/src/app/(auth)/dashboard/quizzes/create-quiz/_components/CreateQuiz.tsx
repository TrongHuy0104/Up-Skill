'use client';
import React, { useState, useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  courseData: { videoSection: string; quizzes: string[] }[];
}

interface CreateQuizProps {
  courses: Course[]; // List of courses with video sections
  instructorId: string; // ID of the instructor creating the quiz
}

const CreateQuiz: React.FC<CreateQuizProps> = ({ courses, instructorId }) => {
  // State for form inputs
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [duration, setDuration] = useState<number>(0);
  const [passingScore, setPassingScore] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [questions] = useState<any[]>([]);
  const [order, setOrder] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedVideoSection, setSelectedVideoSection] = useState<string>('');
  const [videoSections, setVideoSections] = useState<string[]>([]);

  // Fetch video sections when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find((course) => course._id === selectedCourseId);
      if (selectedCourse) {
        const sections = selectedCourse.courseData.map((data) => data.videoSection);
        setVideoSections(sections);
        setSelectedVideoSection(''); // Reset video section when course changes
      }
    }
  }, [selectedCourseId, courses]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuiz = {
      title,
      description,
      difficulty,
      duration,
      passingScore,
      maxAttempts,
      isPublished,
      instructorId,
      questions,
      order,
      videoSection: selectedVideoSection,
      courseId: selectedCourseId,
    };

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const data = await response.json();
      alert('Quiz created successfully!');
      console.log('Created Quiz:', data);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quiz Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Quiz Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Passing Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
          <input
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Max Attempts */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
          <input
            type="number"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Is Published */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Publish Quiz</label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mt-1 block"
          />
        </div>

        {/* Questions (Placeholder for now) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Questions</label>
          <p className="text-sm text-gray-500">Add questions functionality coming soon.</p>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Video Section Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Video Section</label>
          <select
            value={selectedVideoSection}
            onChange={(e) => setSelectedVideoSection(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={!selectedCourseId}
          >
            <option value="" disabled>
              Select a video section
            </option>
            {videoSections.map((section, index) => (
              <option key={index} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;