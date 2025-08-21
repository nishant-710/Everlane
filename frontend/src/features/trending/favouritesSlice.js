import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const fetchfavByCategory = createAsyncThunk(
  'fav/fetchByCategory',
  async ({ categoryId,mainId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/products`, { categoryId,mainId });
      console.log("ddadad---->>>",response.data);
      return response.data?.fav ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favourite products');
    }
  }
);

const favouriteSlice = createSlice({
  name: 'fav',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavourites: (state) => {
      state.items = [];
      state.error = null;
    },
    setFavourites: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchfavByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchfavByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchfavByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavourites, setFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
