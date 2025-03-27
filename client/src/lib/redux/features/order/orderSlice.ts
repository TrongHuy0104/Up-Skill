import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
    courses: any[];
    couponInfo: {
        discountPercentage: number;
        discountedTotal: number;
    };
}

const initialState: OrderState = {
    courses: [],
    couponInfo: {
        discountPercentage: 0,
        discountedTotal: 0,
    },
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        orderCreatePaymentIntent: (state, action: PayloadAction<{ course?: any, cartItems?: any[], couponInfo?: { discountPercentage: number, discountedTotal: number } }>) => {
            if (action.payload.course) {
                state.courses = [action.payload.course];
            } else if (action.payload.cartItems) {
                state.courses = action.payload.cartItems;
            } if (action.payload.couponInfo) {
                state.couponInfo = action.payload.couponInfo;
            }
        },
        setCouponInfo: (state, action: PayloadAction<{ discountPercentage: number, discountedTotal: number }>) => {
            state.couponInfo = action.payload;
        },
    }
});

export const { orderCreatePaymentIntent, setCouponInfo } = orderSlice.actions;

export default orderSlice.reducer;
