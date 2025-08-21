import React from 'react';

const MobileMenu = ({
  user,
  token,
  totalCount,
  navigate,
  openLoginModal,
  logoutUser,
  dispatch,
  setEditModalVisible
}) => (
  <div className="sm:hidden px-4 py-3 space-y-4">
    <div className="flex flex-col gap-3">
      {!user && !token ? (
        <button onClick={openLoginModal} className="text-left text-blue-600">
          Login
        </button>
      ) : (
        <button onClick={() => dispatch(logoutUser())} className="text-left text-red-600">
          Logout
        </button>
      )}
      <button onClick={() => setEditModalVisible(true)} className="text-left">
        Edit Profile
      </button>
      <button onClick={() => navigate('/myOrders')} className="text-left">
        My Orders
      </button>
      <button onClick={() => navigate('/cart')} className="text-left">
        Cart ({totalCount})
      </button>
    </div>
  </div>
);

export default MobileMenu;
