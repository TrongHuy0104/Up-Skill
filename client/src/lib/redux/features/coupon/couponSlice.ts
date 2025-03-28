import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CouponState {
    code: string | null;
    discountPercentage: number;
}

const initialState: CouponState = {
    code: null,
    discountPercentage: 0
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        applyCoupon: (state, action: PayloadAction<{ code: string; discountPercentage: number }>) => {
            state.code = action.payload.code;
            state.discountPercentage = action.payload.discountPercentage;
        },
        clearCoupon: (state) => {
            state.code = null;
            state.discountPercentage = 0;
        }
    }
});

export const { applyCoupon, clearCoupon } = couponSlice.actions;

export default couponSlice.reducer;
