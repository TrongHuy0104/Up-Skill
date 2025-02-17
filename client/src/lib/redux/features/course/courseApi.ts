import { apiSlice } from '../api/apiSlice';

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
        })
    })
});

export const { useCreateCourseMutation, useUpdateCourseMutation } = courseApi;
