import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCartAsync,
  increaseCartAsync,
  decreaseCartAsync,
  
} from '../features/trending/CartSlice.js';

export default function useCart() {
  const dispatch = useDispatch();
  const { items, totalCount, error } = useSelector(state => state.cart);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(getCartAsync(token));
    }
  }, [dispatch, token]);

  const add = (item) => {
    if (!token) return;
    dispatch(increaseCartAsync({ itemId: item._id, token }))
      .then(() => dispatch(getCartAsync(token)));
  };

  const remove = (item) => {
    if (!token) return;
    dispatch(decreaseCartAsync({ itemId: item._id, token }))
      .then(() => dispatch(getCartAsync(token)));
  };

  return {
    items,
    totalCount,
    error,
    add,
    remove,
  };
}
