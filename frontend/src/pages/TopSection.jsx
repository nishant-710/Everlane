import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNavbarByCategory,
  setCategoriesRedux,
  setCategoriesHeroidRedux
} from '../features/trending/navbarSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const TopSection = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { top_items } = useSelector((state) => state.nav);


  useEffect(() => {
    dispatch(fetchNavbarByCategory());
  }, [dispatch]);


  useEffect(() => {
    
    const params = new URLSearchParams(location.search);
    const selectedCategoryId = params.get('categoryId');

    if (selectedCategoryId) {
      dispatch(setCategoriesRedux(selectedCategoryId));
      dispatch(setCategoriesHeroidRedux(null));
    }
  }, [location.search, dispatch]);

  const handleCategoryClick = (categoryId) => {

    dispatch(setCategoriesRedux(categoryId));
    dispatch(setCategoriesHeroidRedux(null));

    const params = new URLSearchParams(location.search);
    params.set('categoryId', categoryId);

    navigate({ search: params.toString() });
  };

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div className="flex gap-3 flex-nowrap">
        {top_items?.map((data, idx) => (
          <button
            key={idx}
            className="px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleCategoryClick(data._id)}
          >
            {data.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopSection;
