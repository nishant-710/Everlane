import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_BASEURL_API;

export const submitShippingDetails = createAsyncThunk(
    'shipping/submitShippingDetails',
    async (payload, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${API_URL}/user/shippingDetails`, payload, config);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const editShippingDetails = createAsyncThunk(
    'shipping/editShippingDetails',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${API_URL}/user/editShippingDetails`, { id, ...payload }, config);
           toast.success("updated successfully");
            return response.data;

        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getCartAsync = createAsyncThunk(
    'shipping/getCartAsync',
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

export const ListShippingDetails = createAsyncThunk(
    'shipping/listShippingDetails',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/user/getShippingDetails`, config);
            return response.data.details;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteShippingDetails = createAsyncThunk(
    'shipping/deleteShippingDetails',
    async (_id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            await axios.post(`${API_URL}/user/deleteShippingDetails`, { id: _id }, config);
            return _id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const SavedSelectedAddressDetails = createAsyncThunk(
    'shipping/SavedSelectedDetails',
    async (_id, { rejectWithValue }) => {
        try {
            console.log(_id);
            return _id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createOrder = createAsyncThunk(
    'shipping/createOrder',
    async (selectedDetailsId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            
            const response = await axios.post(
                `${API_URL}/user/createOrder`,
                { selectedDetailsId },
                config
            );

            console.log(response);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    'shipping/verifyPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            
            const response = await axios.post(
                `${API_URL}/user/verifyPayment`,
                paymentData,
                config
            );
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const shippingSlice = createSlice({
    name: 'shipping',
    initialState: {
        loading: false,
        success: false,
        error: null,
        data: null,
        items: [],
        cartLoading: false,
        cartError: null,
        savedAddresses: [],
        selectedAddressId: null,
        orderLoading: false,
        orderSuccess: false,
        orderError: null,
        orderData: null,
        paymentLoading: false,
        paymentSuccess: false,
        paymentError: null,
        paymentData: null,
        editLoading: false,
        editSuccess: false,
        editError: null,
        editData: null,
    },
    reducers: {
        resetShippingStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.data = null;
        },
        resetEditStatus: (state) => {
            state.editLoading = false;
            state.editSuccess = false;
            state.editError = null;
            state.editData = null;
        },
        resetOrderStatus: (state) => {
            state.orderLoading = false;
            state.orderSuccess = false;
            state.orderError = null;
            state.orderData = null;
        },
        resetPaymentStatus: (state) => {
            state.paymentLoading = false;
            state.paymentSuccess = false;
            state.paymentError = null;
            state.paymentData = null;
        },
        clearAllErrors: (state) => {
            state.error = null;
            state.cartError = null;
            state.orderError = null;
            state.paymentError = null;
            state.editError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitShippingDetails.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitShippingDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload;
            })
            .addCase(submitShippingDetails.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            .addCase(editShippingDetails.pending, (state) => {
                state.editLoading = true;
                state.editSuccess = false;
                state.editError = null;
            })
            .addCase(editShippingDetails.fulfilled, (state, action) => {
                state.editLoading = false;
                state.editSuccess = true;
                state.editData = action.payload;
                const updatedAddress = action.payload.details || action.payload;
                const index = state.savedAddresses.findIndex(addr => addr._id === updatedAddress._id);
                if (index !== -1) {
                    state.savedAddresses[index] = updatedAddress;
                }
            })
            .addCase(editShippingDetails.rejected, (state, action) => {
                state.editLoading = false;
                state.editSuccess = false;
                state.editError = action.payload;
            })

            .addCase(getCartAsync.pending, (state) => {
                state.cartLoading = true;
                state.cartError = null;
            })
            .addCase(getCartAsync.fulfilled, (state, action) => {
                state.cartLoading = false;
                state.items = action.payload.cart?.items || [];
                state.totalCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
                state.cartError = null;
            })
            .addCase(getCartAsync.rejected, (state, action) => {
                state.cartLoading = false;
                state.cartError = action.payload || 'Failed to fetch cart';
            })

            .addCase(ListShippingDetails.fulfilled, (state, action) => {
                state.savedAddresses = action.payload;
            })
            .addCase(ListShippingDetails.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteShippingDetails.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.savedAddresses = state.savedAddresses.filter(addr => addr._id !== deletedId);
            })
            .addCase(deleteShippingDetails.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(SavedSelectedAddressDetails.fulfilled, (state, action) => {
                state.selectedAddressId = action.payload;
            })
            .addCase(SavedSelectedAddressDetails.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(createOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderSuccess = false;
                state.orderError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.orderSuccess = true;
                state.orderData = action.payload;
                state.orderError = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderSuccess = false;
                state.orderError = action.payload;
                state.orderData = null;
            })

            .addCase(verifyPayment.pending, (state) => {
                state.paymentLoading = false;
                state.paymentSuccess = false;
                state.paymentError = null;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.paymentLoading = false;
                state.paymentSuccess = true;
                state.paymentData = action.payload;
                state.paymentError = null;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.paymentLoading = false;
                state.paymentSuccess = false;
                state.paymentError = action.payload;
                state.paymentData = null;
            });
    },
});

export const { 
    resetShippingStatus, 
    resetEditStatus,
    resetOrderStatus, 
    resetPaymentStatus, 
    clearAllErrors 
} = shippingSlice.actions;

export default shippingSlice.reducer;