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

  // Fetch cookies when the component is mounted
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
      // Get the selected course
      const selectedCourse = courses.find((course) => course._id === data.courseId);
      if (!selectedCourse) {
        throw new Error('Course not found');
      }

      // Send POST request with quiz data and cookie in headers
      const response = await fetch('http://localhost:8000/api/quizzes/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie || '',
        },
        body: JSON.stringify({
          ...data,
          instructorId: selectedCourse.authorId, // Set authorId from the selected course
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quiz');
      }

      // Redirect to quizzes page after successful quiz creation
      router.push('/dashboard/quizzes/create-quiz');
      toast({
        variant: 'success',
        title: 'Quiz created!'
    });
    } catch (error) {
      console.error('Error creating quiz:', error);
      const errorData = error as any;
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorData
    });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Selection */}
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <select className="w-full p-2 border rounded-md" {...field}>
                  <option value="">Select a course</option>
                  {courses?.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video Section Selection */}
        <VideoSectionSelector
          videoSections={videoSections}
          selectedCourse={!!selectedCourse}
        />

        {/* Quiz Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter quiz title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quiz Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea className="w-full p-2 border rounded-md" {...field} placeholder="Describe the quiz" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty */}
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <select className="w-full p-2 border rounded-md" {...field}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Passing Score */}
        <FormField
          control={form.control}
          name="passingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passing Score (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="70" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Attempts */}
        <FormField
          control={form.control}
          name="maxAttempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Attempts</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" variant="default" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Quiz'}
        </Button>
      </form>
    </Form>
  );
};


