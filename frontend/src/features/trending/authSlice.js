import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
      localStorage.setItem("token", response.data?.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(

  'auth/logoutUser',
  
  async (_, { rejectWithValue }) => {
  
    try {
  
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editUserProfile = createAsyncThunk(
  
  'auth/editUserProfile',
  
  async (payload, { rejectWithValue }) => {
  
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/user/editProfile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
  
    } catch (error) {
  
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchUserOrders = createAsyncThunk(
  'auth/fetchUserOrders',
  
  async (_, { rejectWithValue }) => {
  
    try {
  
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/user/myOrders`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  
  name: 'auth',
  
  initialState: {
  
    user: null,
    error: null,
    loading: false,
    islogIn: false,
    loginModalOpen: false,
    orders: [],
    ordersLoading: false,
  },
  
  reducers: {
  
    setModalOpen: (state, action) => {
      state.loginModalOpen = action.payload;
    },
  },
  
  extraReducers: (builder) => {
  
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.islogIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.islogIn = false;
        state.orders = [];
      })

      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersLoading = false;
      })
      
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setModalOpen } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
