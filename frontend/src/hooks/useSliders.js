import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSlidersByCategory, fetchAllSliders } from '../features/trending/sliderSlice';

const useSliders = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slider);
  const { mainId } = useSelector((state) => state.nav);

  const handleCategoryClick = () => {
    if (mainId) {
      dispatch(fetchProductsByCategory({ mainId }));
    }
  };

  useEffect(() => {

    if (mainId) {

      dispatch(fetchSlidersByCategory({ mainId }));

    } else {

      dispatch(fetchAllSliders());
    }
  }, [mainId, dispatch]);

  return { slides, loading, error, mainId, handleCategoryClick };
};


export default useSliders;
