import { apiSlice } from '../api/apiSlice';

export const couponApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all coupons
        getAllCoupons: builder.query({
            query: () => ({
                url: 'coupon/all',
                method: 'GET',
                credentials: 'include' as const
            })
        }),
        // Create a new coupon
        createCoupon: builder.mutation({
            query: (couponData) => ({
                url: 'coupon/create',
                method: 'POST',
                body: couponData,
                credentials: 'include' as const
            })
        }),
        // Update an existing coupon
        updateCoupon: builder.mutation({
            query: ({ id, couponData }) => ({
                url: `coupon/${id}`,
                method: 'PUT',
                body: couponData,
                credentials: 'include' as const
            })
        }),
        // Delete a coupon
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `coupon/${id}`,
                method: 'DELETE',
                credentials: 'include' as const
            })
        }),
        // Validate a coupon
        validateCoupon: builder.mutation({
            query: (couponCode) => ({
                url: 'coupon/validate',
                method: 'POST',
                body: { code: couponCode },
                credentials: 'include' as const
            })
        })
    })
});

export const {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation
} = couponApi;
