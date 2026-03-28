import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loader: {
        isVisible: false,
        text: 'Loading...',
    },
    alerts: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showLoader: (state, action) => {
            state.loader.isVisible = true;
            state.loader.text = action.payload || 'Loading...';
        },
        hideLoader: (state) => {
            state.loader.isVisible = false;
        },
        setLoaderText: (state, action) => {
            state.loader.text = action.payload;
        },
        addAlert: (state, action) => {
            const { type, title, message, duration } = action.payload;
            state.alerts.push({
                id: Date.now(),
                type: type || 'info',
                title: title || '',
                message: message || '',
                duration: duration || 5000,
            });
        },
        removeAlert: (state, action) => {
            state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
        },
    },
});

export const { showLoader, hideLoader, setLoaderText, addAlert, removeAlert } = uiSlice.actions;
export default uiSlice.reducer;
