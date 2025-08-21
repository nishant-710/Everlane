import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfavByCategory } from '../features/trending/favouritesSlice';

export default function useFavorites() {
 
  const dispatch = useDispatch();
  const categoryId = useSelector((state) => state.nav.categoryId);
  const mainId = useSelector((state) => state.nav.mainId);

  const { items, loading, error } = useSelector((state) => state.fav || {});

  useEffect(() => {
  
    if (categoryId || mainId) {
 
      dispatch(fetchfavByCategory({ categoryId, mainId }));
 
    }
  
  }, [categoryId, mainId, dispatch]);

  return {
    items,
    loading,
    error,
  };
}
