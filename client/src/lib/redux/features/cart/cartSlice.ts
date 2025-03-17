import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    courseId: string;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.courseId === action.payload.courseId);
            if (!existingItem) {
                state.items.push(action.payload);
            }
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.courseId !== action.payload);
        },
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const { addCartItem, removeCartItem, setCartItems } = cartSlice.actions;

export default cartSlice.reducer;