import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ mainId, filterId,categoryId }, { rejectWithValue }) => {
    console.log('Fetching with mainId:', mainId, 'filterId:', filterId,categoryId);

    const obj = {
      mainId: null,
      filterId: null,
      categoryId: null,
    };
    console.log("hxhxhhx", obj);
    
    if (mainId) {
      obj.mainId = mainId;
    }

    if (filterId) {
      obj.filterId = filterId;
    }
    if (categoryId) {
      obj.categoryId = categoryId;
    }
    console.log("hshshshs", obj)
    console.log('Fetching products with:', obj);
    
    try {
      const response = await axios.post(`${API_URL}/user/products`, obj);
      console.log('Fetched products:', response);
      return response.data?.products ?? [];

    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({

  name: 'products',
  
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
  
    clearProducts: (state) => {
      state.items = [];
      state.error = null;
    },
  
    setProduct: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
  
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export const { clearProducts, setProduct } = productSlice.actions;
export default productSlice.reducer;
