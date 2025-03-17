// orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
    courses: any[];
}

const initialState: OrderState = {
    courses: []
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        orderCreatePaymentIntent: (state, action: PayloadAction<{ course?: any, cartItems?: any[] }>) => {
            if (action.payload.course) {
                // Handle single course purchase from "Buy Now"
                state.courses = [action.payload.course];
            } else if (action.payload.cartItems) {
                // Handle multiple courses purchase from Shop Cart
                state.courses = action.payload.cartItems;
            } else {
                state.courses = []; // Fallback to empty array if no course or cartItems provided
            }
        }
    }
});

export const { orderCreatePaymentIntent } = orderSlice.actions;

export default orderSlice.reducer;