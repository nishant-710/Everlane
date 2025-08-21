import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const fetchNavbarByCategory = createAsyncThunk(

    'nav/fetchNavbarByCategory',
    async (mainId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user/dashboard`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',

                }
            });
            return response.data?.categories ?? [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch sliders');
        }
    }
);

export const fetchHeroNavbarByCategory = createAsyncThunk(
    'nav/fetchHeroNavbarByCategory',
    async (mainId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user/filters`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',

                }
            });

            return response.data?.filters ?? [];


        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch sliders');
        }
    }
);


const NavbarSlice = createSlice({
    
    name: 'nav',
    initialState: {
        top_items: [],
        hero_items: [],
        loading: false,
        error: null,
        mainId: null,        
        categoryHeroid: null

    },
    reducers: {
        setCategoriesRedux: (state, action) => {
            state.mainId = action.payload
        },
        setCategoriesHeroidRedux: (state, action) => {
            state.categoryHeroid = action.payload
        }


    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchNavbarByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchNavbarByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.top_items = action.payload;
            })

            .addCase(fetchNavbarByCategory.rejected, (state, action) => {
                state.top_items = [];
                state.loading = false;
                state.error = action.payload;


            }).addCase(fetchHeroNavbarByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchHeroNavbarByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.hero_items = action.payload;
            })

            .addCase(fetchHeroNavbarByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hero_items = [];
            });
    },
});


export const { setCategoriesRedux, setCategoriesHeroidRedux } = NavbarSlice.actions

export default NavbarSlice.reducer;
