import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    token: '',
    user: '',
    isLoggingOut: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        userLoggerIn: (state, action: PayloadAction<{ accessToken: string; user: string }>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            state.isLoggingOut = false;
        },
        userLoggerOut: (state) => {
            state.token = '';
            state.user = '';
            state.isLoggingOut = true;
        }
    }
});

export const { userRegistration, userLoggerIn, userLoggerOut } = authSlice.actions;

export default authSlice.reducer;
