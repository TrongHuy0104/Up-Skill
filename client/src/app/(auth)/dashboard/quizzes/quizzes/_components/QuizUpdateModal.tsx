import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { VideoSectionSelector } from '../../create-quiz/_components/VideoSectionSelector';
import { Input } from '@/components/ui/Input';

const formSchema = z.object({
  courseId: z.string().min(1, { message: 'Course is required' }),
  videoSection: z.string().min(1, { message: 'Video section is required' }),
  title: z.string().min(3, { message: 'Title is required and must be at least 3 characters.' }),
  description: z.string().min(1, { message: 'Description is required' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(1, { message: 'Duration must be at least 1 minute' }),
  passingScore: z.number().min(0).max(100, { message: 'Passing score must be between 0 and 100' }),
  maxAttempts: z.number().min(1, { message: 'Max attempts must be at least 1' }),
  isPublished: z.boolean(),
});

interface Course {
  _id: string;
  name: string;
  authorId: string;
  courseData: Array<{ videoSection: string; title: string; description: string }>;
}

interface QuizUpdateModalProps {
  quiz: any;
  courses: Course[];
  onClose: () => void;
  onUpdate: (updatedQuiz: any) => void;
}

export default function QuizUpdateModal({ quiz, courses, onClose, onUpdate }: QuizUpdateModalProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: quiz.courseId || '',
      videoSection: quiz.videoSection || '',
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      isPublished: quiz.isPublished,
    },
  });

  const selectedCourse = Array.isArray(courses)
    ? courses.find((course) => course._id === form.watch('courseId'))
    : undefined;

  console.log(courses);

  const videoSections = selectedCourse
    ? selectedCourse.courseData.map((section) => ({
      videoSection: section.videoSection,
      title: section.title,
      description: section.description,
    }))
    : [];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
      const response = await fetch(`${baseURL}/quizzes/${quiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update quiz');

      const updatedQuiz = await response.json();
      onUpdate(updatedQuiz.quiz);
      toast({ variant: 'success', title: 'Quiz updated successfully!' });
      onClose();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to update quiz' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Quiz</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

            {/* Course Selector */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Course</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Video Section Selector */}
            <VideoSectionSelector videoSections={videoSections} selectedCourse={!!selectedCourse} />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter quiz title"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Describe the quiz"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Difficulty */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Difficulty</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Passing Score */}
            <FormField
              control={form.control}
              name="passingScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Max Attempts */}
            <FormField
              control={form.control}
              name="maxAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Max Attempts</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all hover:shadow-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Published Status */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Published</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="ml-2 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-primary-500 transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Update Quiz</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>

  );
}