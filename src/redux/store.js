import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import hospitalReducer from './hospitalSlice';

const store = configureStore({
    reducer: {
        ui: uiReducer,
        hospitals: hospitalReducer,
    },
});

export default store;
