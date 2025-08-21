import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import img2 from "../images/img2.png";
import img3 from "../images/img3.png";
import img10 from "../images/img10.png";

import EditProfileModal from './EditModal.jsx';
import LoginModal from "../components/LoginModal";
import useNavbarData from '../hooks/useNavbarData.js';
import useNavbarLogic from '../hooks/useNavbarLogic.js';
import { logoutUser } from "../features/trending/authSlice";

import TopSection from '../pages/TopSection.jsx';
import HeroSection from '../pages/HeroSection.jsx';
import MobileMenu from '../pages/MobileMenu.jsx';
import { Search } from 'lucide-react';

const Navbar1 = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASEURL_API;

  const { loginModalOpen } = useSelector((state) => state.auth);
  const totalCount = useSelector((state) => state.cart.totalCount);
  const user = useSelector((state) => state.auth.user);

  const {

    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchBar,
    setShowSearchBar,
    handleSearchSubmit,
    handleSearchItemClick,
    editModalVisible,
    setEditModalVisible,
    selectedItem
  } = useNavbarLogic(API_URL);

  const {

    token,
    subcategories,
    setSubcategories,
    activeDropdownId,
    setActiveDropdownId,
    fetchSubcategories,
    openLoginModal,
    closeLoginModal,
  } = useNavbarData(user, API_URL);

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-white w-full relative">
      <nav className="border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          <div className="flex items-center space-x-4">
            <img
              src={img10}
              alt="logo"
              className="w-16 sm:w-20 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="hidden sm:block">
              <TopSection />
            </div>
          </div>

          <div className="text-lg sm:text-xl font-semibold text-gray-900">EVERLANE</div>

          <div className="hidden sm:flex items-center space-x-4">

            <div className="relative search-dropdown">

              <div className='flex'>

                <Search
                  className="w-7 h-5 flex items-start font-extrabold cursor-pointer"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                />
              </div>

              <div>

                {showSearchBar && (

                  <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mt-1">
                   
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border px-3 py-1 rounded-[12px] border-blue-400"
                      placeholder="Search products..."
                    />
                  </form>
                )}
              </div>

              {searchQuery.trim() && (
                
                <div className="absolute top-full left-0 w-72 bg-white shadow-md z-50 px-4 py-2 max-h-60 overflow-y-auto mt-1">

                  {searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((item, index) => (
                        <li
                          key={item._id || index}
                          className="py-1 hover:bg-gray-100 cursor-pointer px-2"
                          onClick={() => handleSearchItemClick(item)}
                        >
                          {item.name || item.title || JSON.stringify(item)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 px-2">No results found</div>
                  )}
                </div>
              )}
            </div>

            {!user && !token ? (
              <img
                src={img2}
                alt="login"
                onClick={openLoginModal}
                className="w-5 h-5 cursor-pointer"
              />
            ) : (
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  navigate('/');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            )}

            <button
              className="bg-red-600 rounded-[10px] px-4 py-2 text-white"
              onClick={() => setEditModalVisible(true)}
            >
              Edit
            </button>

            <button
              className="bg-yellow-600 rounded-[10px] px-4 py-2 text-white"
              onClick={() => navigate('/myOrders')}
            >
              Orders
            </button>

            <div
              className="relative cursor-pointer"
              onClick={() => navigate('/cart')}
            >
              <img src={img3} alt="cart" className="w-10 h-10" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2">
                  {totalCount}
                </span>
              )}
            </div>
          </div>

          <div className="sm:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <MobileMenu
          user={user}
          token={token}
          totalCount={totalCount}
          navigate={navigate}
          openLoginModal={openLoginModal}
          logoutUser={logoutUser}
          dispatch={dispatch}
          setEditModalVisible={setEditModalVisible}
        />
      ) : (
        <HeroSection
          activeDropdownId={activeDropdownId}
          setActiveDropdownId={setActiveDropdownId}
          fetchSubcategories={fetchSubcategories}
          subcategories={selectedItem ? [selectedItem] : subcategories}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      <LoginModal visible={loginModalOpen && !token} onClose={closeLoginModal} />
      <EditProfileModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} />
    </div>
  );
};

export default Navbar1;
