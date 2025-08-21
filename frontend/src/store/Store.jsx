import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/trending/productSlice.js';
import sliderSlice from '../features/trending/sliderSlice.js';
import navbarSlice from '../features/trending/navbarSlice.js';
import favouriteSlice from "../features/trending/favouritesSlice.js";
import cartSlice from "../features/trending/CartSlice.js"
import {authSliceReducer} from "../features/trending/authSlice.js";
import shippingSlice from "../features/trending/shippingSlice.js";

const store = configureStore({
  reducer: {
    products: productReducer,
    slider: sliderSlice,
    nav:navbarSlice,
    auth: authSliceReducer,
    fav:favouriteSlice,
    cart:cartSlice,
    shipping:shippingSlice,

  },
});

export default store;
