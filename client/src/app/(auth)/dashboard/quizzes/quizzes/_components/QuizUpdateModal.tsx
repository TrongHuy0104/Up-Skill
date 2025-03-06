'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Quiz } from '@/types/Quiz';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/custom/Input';

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title is required and must be at least 3 characters.' }),
  description: z.string().min(1, { message: 'Description is required' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(1, { message: 'Duration must be at least 1 minute' }),
  passingScore: z.number().min(0).max(100, { message: 'Passing score must be between 0 and 100' }),
  maxAttempts: z.number().min(1, { message: 'Max attempts must be at least 1' }),
  isPublished: z.boolean(),
});

interface QuizUpdateModalProps {
  quiz: Quiz;
  onClose: () => void;
  onUpdate: (updatedQuiz: Quiz) => void;
}

export default function QuizUpdateModal({ quiz, onClose, onUpdate }: QuizUpdateModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      isPublished: quiz.isPublished,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
      const response = await fetch(`${baseURL}/quizzes/${quiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      const data = await response.json();
      onUpdate(data.quiz); // Notify parent component of the update
      toast({
        variant: 'success',
        title: 'Quiz Updated!',
      });
      onClose(); // Close the modal
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update quiz',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Quiz</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full p-2 border rounded-md"
                      placeholder="Describe the quiz"
                      rows={3}
                    />
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
                    <select
                      {...field}
                      className="w-full p-2 border rounded-md"
                    >
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="30"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="70"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Published Status */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="ml-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}