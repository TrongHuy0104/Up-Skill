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
        }),
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: 'user/update-password',
                method: 'PUT',
                body: { oldPassword, newPassword },
                credentials: 'include' as const
            })
        })
    })
});

export const { useUpdateUserInfoMutation, useUpdateAvatarMutation, useUpdatePasswordMutation } = userApi;
