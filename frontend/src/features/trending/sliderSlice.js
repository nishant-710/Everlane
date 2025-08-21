import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const fetchSlidersByCategory = createAsyncThunk(
  'slider/fetchSlidersByCategory',
  async ({ mainId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/sliders`, {
        mainId: mainId,
      });
      return response.data?.sliders ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sliders');
    }
  }
);

export const fetchAllSliders = createAsyncThunk(
  'slider/fetchAllSliders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/sliders`, {});       
      return response.data?.sliders ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all sliders');
    }
  }
);

const initialState = {
  slides: [],
  loading: false,
  error: null,
};

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {
    clearSliders: (state) => {
      state.slides = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSlidersByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlidersByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
      })
      .addCase(fetchSlidersByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
      })
      .addCase(fetchAllSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSliders } = sliderSlice.actions;
export default sliderSlice.reducer;
// export { fetchSlidersByCategory, fetchAllSliders };
