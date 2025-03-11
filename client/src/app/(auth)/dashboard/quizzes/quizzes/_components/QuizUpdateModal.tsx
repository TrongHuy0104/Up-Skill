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
  readonly quiz: Quiz;
  readonly onClose: () => void;
  readonly onUpdate: (updatedQuiz: Quiz) => void;
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
    <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Update Quiz</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-100">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter quiz title"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-200">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Describe the quiz"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Difficulty */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-300">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Difficulty</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
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

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-400">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="30"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Passing Score */}
            <FormField
              control={form.control}
              name="passingScore"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-500">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="70"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Max Attempts */}
            <FormField
              control={form.control}
              name="maxAttempts"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-600">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Max Attempts</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="3"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Published Status */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up delay-700">
                  <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Published</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="ml-2 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105"
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