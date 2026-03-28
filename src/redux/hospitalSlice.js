import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHospitals = createAsyncThunk(
    'hospitals/fetchHospitals',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/db.json');
            return response.data.hospitals;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    list: [],
    selectedHospital: null,
    userLocation: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchQuery: '',
};

const hospitalSlice = createSlice({
    name: 'hospitals',
    initialState,
    reducers: {
        selectHospital: (state, action) => {
            state.selectedHospital = action.payload;
        },
        setUserLocation: (state, action) => {
            state.userLocation = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSelection: (state) => {
            state.selectedHospital = null;
        },
        repositionHospitals: (state, action) => {
            const { lat, lng } = action.payload;
            // Only reposition once or if explicitly called
            // We use a small random offset for each hospital to keep them clustered but distinct
            state.list = state.list.map((hospital, index) => {
                // Calculate original offset from a base point (e.g., first hospital or city center)
                // For demo, we'll just spread them around the new center
                const angle = (index / state.list.length) * 2 * Math.PI;
                const radius = 0.02 + Math.random() * 0.05; // 2km to 7km approx
                return {
                    ...hospital,
                    lat: lat + radius * Math.cos(angle),
                    lng: lng + radius * Math.sin(angle)
                };
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHospitals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHospitals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchHospitals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { selectHospital, setUserLocation, setSearchQuery, clearSelection, repositionHospitals } = hospitalSlice.actions;
export default hospitalSlice.reducer;
