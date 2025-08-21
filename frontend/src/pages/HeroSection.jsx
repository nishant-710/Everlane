import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroNavbarByCategory } from '../features/trending/navbarSlice';
import { fetchProductsByCategory } from '../features/trending/productSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const HeroSection = ({

  activeDropdownId,
  setActiveDropdownId,
  fetchSubcategories,
  subcategories,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {

  const dispatch = useDispatch();

  const { hero_items, mainId } = useSelector((state) => state.nav);

  useEffect(() => {
    dispatch(fetchHeroNavbarByCategory());
  }, [dispatch]);


  const handleSubcategoryClick = (subcategoryId) => {
    dispatch(fetchProductsByCategory({
      mainId,
      filterId: activeDropdownId,
      categoryId: subcategoryId
    }));
    setActiveDropdownId(null);
    setMobileMenuOpen(false);
  };

  return (
    <div className="px-2 sm:px-4 mt-2">
      <div className="flex flex-wrap gap-4 text-gray-600 ml-6">
        {hero_items.map((item) => (
          <div
            key={item._id}
            className="relative cursor-pointer px-4 py-2 rounded"
            onMouseEnter={() => !mobileMenuOpen && fetchSubcategories({ mainId, filterId: item._id })}
            onMouseLeave={() => !mobileMenuOpen && setActiveDropdownId(null)}
            onClick={() => mobileMenuOpen && fetchSubcategories({ mainId, filterId: item._id })}
          >
            {item.name}

            {activeDropdownId === item._id && (
              <div
                className="absolute sm:top-full sm:left-0 sm:mt-1 bg-white shadow-md rounded-lg p-4 w-56 z-50 sm:block"
                onMouseEnter={() => setActiveDropdownId(item._id)}
                onMouseLeave={() => setActiveDropdownId(null)}
              >
                <h2 className="text-lg font-semibold mb-2">Subcategories</h2>
                {subcategories.length > 0 ? (
                  <ul>
                    {subcategories.map((sub) => (
                      <li
                        key={sub._id}
                        className="cursor-pointer p-2 text-sm rounded hover:bg-gray-100"
                        onClick={() => handleSubcategoryClick(sub._id)}
                      >
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No subcategories found.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
