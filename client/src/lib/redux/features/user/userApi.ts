import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUserInfo: builder.mutation({
            query: (data) => ({
                url: 'user/update-user',
                method: 'PUT',
                body: data,
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
        }),
        updateLink: builder.mutation({
            query: (data) => ({
                url: 'user/update-link', // Route mới cho cập nhật các liên kết xã hội
                method: 'PUT',
                body: { ...data },
                credentials: 'include' as const
            })
        })
    })
});

export const { useUpdateUserInfoMutation, useUpdateAvatarMutation, useUpdatePasswordMutation, useUpdateLinkMutation } =
    userApi;
