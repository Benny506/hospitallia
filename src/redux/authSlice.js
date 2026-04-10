import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    session: null,
    isAuthenticated: false,
    authChecked: false, // Tracking the initial app load check
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.isAuthenticated = !!action.payload.session;
            state.authChecked = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.authChecked = true;
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
