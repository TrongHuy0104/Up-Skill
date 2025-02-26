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
        orderCreatePaymentIntent: (state, action: PayloadAction<{ course: any }>) => {
            state.courses = [...state.courses, action.payload.course];
        }
    }
});

export const { orderCreatePaymentIntent } = orderSlice.actions;

export default orderSlice.reducer;
