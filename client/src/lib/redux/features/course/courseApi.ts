import { apiSlice } from '../api/apiSlice';

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourseContent: builder.query({
            query: (id) => ({
                url: `courses/purchased/${id}`,
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: 'courses/create-course',
                method: 'POST',
                body: data,
                credentials: 'include' as const
            })
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `courses/update-course/${id}`,
                method: 'PUT',
                body: { ...data.data },
                credentials: 'include' as const
            })
        }),
        addNewQuestion: builder.mutation({
            query: ({ question, contentId, courseId }) => ({
                url: 'courses/add-question',
                method: 'PUT',
                body: { question, contentId, courseId },
                credentials: 'include' as const
            })
        }),
        addAnswerInQuestion: builder.mutation({
            query: ({ answer, questionId, contentId, courseId }) => ({
                url: 'courses/add-answer',
                method: 'PUT',
                body: { answer, questionId, contentId, courseId },
                credentials: 'include' as const
            })
        }),
        addReviewInCourse: builder.mutation({
            query: ({ review, rating, courseId }) => ({
                url: `courses/add-review/${courseId}`,
                method: 'PUT',
                body: { review, rating },
                credentials: 'include' as const
            })
        }),
        addReplyInReview: builder.mutation({
            query: ({ comment, courseId, reviewId }) => ({
                url: `courses/add-reply`,
                method: 'PUT',
                body: { comment, courseId, reviewId },
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useAddNewQuestionMutation,
    useGetCourseContentQuery,
    useAddAnswerInQuestionMutation,
    useAddReviewInCourseMutation,
    useAddReplyInReviewMutation
} = courseApi;
