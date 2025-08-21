import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../features/trending/productSlice';
import { addToCartAsync } from '../features/trending/CartSlice';
import { setModalOpen } from '../features/trending/authSlice';

const useCategoryProducts = () => {
 
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.products);
  const mainId = useSelector((state) => state.nav.mainId);
  const categoryId = useSelector((state) => state.nav.categoryId);
  const categoryHeroid = useSelector((state) => state.nav.categoryHeroid);
  const token = localStorage.getItem('token');
  const islogIn = useSelector((state) => state.auth.islogIn);

  const products = items?.products || items || [];
  const categories = items?.categories || [];

  const [pendingCartProduct, setPendingCartProduct] = useState(null);

  useEffect(() => {

    const obj = { mainId };
    
    if (categoryHeroid) obj.filterId = categoryHeroid;
    if (categoryId) obj.categoryId = categoryId;

    if (mainId) {
      dispatch(fetchProductsByCategory(obj));
    }
  }, [mainId, categoryHeroid, categoryId, dispatch]);

  useEffect(() => {

    if (token && pendingCartProduct) {
    
      dispatch(addToCartAsync({ product: { productId: pendingCartProduct }, token }));
      setPendingCartProduct(null);
    }
  }, [token, pendingCartProduct, dispatch]);

  useEffect(() => {
    
    if (islogIn) {
      dispatch(setModalOpen(false));
    }
  
  }, [islogIn, dispatch]);

  const handleCategoryClick = (mainId) => {
  
    if (mainId) return;
    dispatch(fetchProductsByCategory({ mainId }));
  };

  const addToCart = (productId) => {
  
    if (!token) return setPendingCartProduct(productId);
    dispatch(addToCartAsync({ product: { productId }, token }));
  
  };
  

  return {
    loading,
    error,
    products,
    categories,
    handleCategoryClick,
    addToCart,
  };
};

export default useCategoryProducts;
