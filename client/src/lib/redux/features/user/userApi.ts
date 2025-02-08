import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUserInfo: builder.mutation({
            query: ({ avatar, name }) => ({
                url: 'user/update-user',
                method: 'PUT',
                body: { avatar, name },
                credentials: 'include' as const
            })
        }),
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: 'user/update-avatar',
                method: 'PUT',
                body: { avatar },
                credentials: 'include' as const
            })
        })
    })
});

export const { useUpdateUserInfoMutation, useUpdateAvatarMutation } = userApi;
