import { apiSlice } from '../api/apiSlice';

export const progressApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateLessonCompletion: builder.mutation({
            query: ({ courseId, lessonId, isCompleted }) => ({
                url: `/progress/update-lesson-completion/${courseId}`,
                method: 'PUT',
                body: { lessonId, isCompleted },
                credentials: 'include' as const
            })
        }),
        updateQuizCompletion: builder.mutation({
            query: ({ courseId, quizId, isCompleted }) => ({
                url: `/progress/update-quiz-completion/${quizId}`,
                method: 'PUT',
                body: { courseId, isCompleted },
                credentials: 'include' as const
            })
        }),
        getProgressData: builder.query({
            query: (courseId) => ({
                url: `/progress/${courseId}`,
                method: 'GET',
                credentials: 'include' as const
            })
        })
    })
});

export const { useUpdateLessonCompletionMutation, useUpdateQuizCompletionMutation, useGetProgressDataQuery } =
    progressApi;
