'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';
import { useState, useEffect } from 'react';
import { VideoSectionSelector } from './VideoSectionSelector';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  courseId: z.string().min(1, { message: 'Course is required' }),
  videoSection: z.string().min(1, { message: 'Video section is required' }),
  title: z.string().min(3, { message: 'Title is required and must be at least 3 characters.' }),
  description: z.string().min(1, { message: 'Description is required' }),
  difficulty: z.string(),
  duration: z.number().min(1, { message: 'Duration must be at least 1 minute' }),
  passingScore: z.number().min(0).max(100, { message: 'Passing score must be between 0 and 100' }),
  maxAttempts: z.number().min(1, { message: 'Max attempts must be at least 1' }),
  isPublished: z.boolean(),
  questions: z.array(z.any()),
  order: z.number().min(1, { message: 'Order is required' }),
});

export interface Course {
  _id: string;
  name: string;
  authorId: string;
  courseData: Array<{ videoSection: string; title: string; description: string }>;
}

interface QuizFormProps {
  courses: Course[];
}

export const QuizForm = ({ courses }: QuizFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cookie, setCookie] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    setCookie(cookies);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      videoSection: '',
      title: '',
      description: '',
      difficulty: 'easy',
      duration: 30,
      passingScore: 70,
      maxAttempts: 3,
      isPublished: true,
      questions: [],
      order: 1,
    },
  });

  const selectedCourse = courses?.find((course) => course._id === form.watch('courseId'));
  const videoSections = selectedCourse
    ? selectedCourse.courseData.map((section) => ({
      videoSection: section.videoSection,
      title: section.title,
      description: section.description,
    }))
    : [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const selectedCourse = courses.find((course) => course._id === data.courseId);
      if (!selectedCourse) throw new Error('Course not found');

      const response = await fetch('http://localhost:8000/api/quizzes/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie || '',
        },
        body: JSON.stringify({
          ...data,
          instructorId: selectedCourse.authorId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create quiz');

      router.push('/dashboard/quizzes/create-quiz');
      toast({ variant: 'success', title: 'Quiz created!' });
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({ variant: 'destructive', title: 'Uh oh! Something went wrong.', description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >

        {/* Course Selection */}
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Course</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                >
                  <option value="">Select a course</option>
                  {courses?.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        {/* Video Section Selector */}
        <VideoSectionSelector videoSections={videoSections} selectedCourse={!!selectedCourse} />

        {/* Quiz Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter quiz title"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        {/* Quiz Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Describe the quiz"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                  rows={4}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        {/* Difficulty, Duration, Passing Score, Max Attempts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-[1px]">Difficulty</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter duration"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passingScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Passing Score (%)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter passing score"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Max Attempts</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter max attempts"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full py-3"
        >
          {isLoading ? 'Creating...' : 'Create Quiz'}
        </Button>
      </form>
    </Form>
  );
};