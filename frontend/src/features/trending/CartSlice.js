import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ product, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/cart/add`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      dispatch(addToCart(product));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCartAsync = createAsyncThunk(
  'cart/getCartAsync',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const increaseCartAsync = createAsyncThunk(
  'cart/increaseCartAsync',
  async ({ itemId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/cart/increase`,
        { itemId: itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const decreaseCartAsync = createAsyncThunk(
  'cart/decreaseCartAsync',
  async ({ itemId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/cart/decrease`,
        { itemId: itemId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalCount: 0,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalCount += 1;
    },

    removeFromCart: (state, action) => {
      
      const itemIndex = state.items.findIndex(item => item._id === action.payload._id);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
        state.totalCount = Math.max(0, state.totalCount - 1);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
    },

    deleteFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );
      if (itemIndex !== -1) {
        state.totalCount -= state.items[itemIndex].quantity;
        state.items.splice(itemIndex, 1);
      }
    },
  },

  extraReducers: (builder) => {
    
    builder
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add to cart';
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.error = null;
      })

      .addCase(getCartAsync.fulfilled, (state, action) => {
        const rawItems = action.payload.cart?.items || [];

        state.items = rawItems.map(item => ({
          ...item,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          id: item._id 
        }));

        state.totalCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.error = null;
      })
      .addCase(getCartAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch cart';
      })

      .addCase(increaseCartAsync.fulfilled, (state, action) => {
        const itemId= state.items.find(item => item.id === action.payload.itemId);
        if (itemId) {
          itemId.quantity = action.payload.quantity;
        }
        state.totalCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.error = null;
      })
      .addCase(increaseCartAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to increase item';
      })

      .addCase(decreaseCartAsync.fulfilled, (state, action) => {
        const itemId = state.items.find(item => item.id === action.payload.itemId);
        if (itemId) {
          itemId.quantity = action.payload.quantity;
        }
        state.totalCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.error = null;
      })
      .addCase(decreaseCartAsync.rejected, (state, action) => {
        state.error = action.payload || 'Failed to decrease item';
      })
  }
});

export const { addToCart, removeFromCart, clearCart, deleteFromCart } = cartSlice.actions;
export default cartSlice.reducer;
