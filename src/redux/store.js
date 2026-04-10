import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import hospitalReducer from './hospitalSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        ui: uiReducer,
        hospitals: hospitalReducer,
        auth: authReducer,
    },
});

export default store;
