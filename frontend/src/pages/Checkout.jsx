import React from "react";
import { useCheckout } from "../hooks/useCheckout";

const Checkout = () => {
  const {
    formik,
    isModalOpen,
    selectedAddressForEdit,
    loading,
    items,
    cartLoading,
    cartError,
    savedAddresses,
    selectedAddressId,
    orderLoading,
    paymentLoading,
    handleDeleteAddress,
    handleSelectAddress,
    handleEditAddress,
    handleAddNewAddress,
    handleCloseModal,
    handleCreateOrder,
    calculateTotal,
  } = useCheckout();

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 font-[Playfair_Display] text-gray-800">
        Checkout
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:flex-[2] ">
          <div className="mb-6">
            <button
              onClick={handleAddNewAddress}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Add New Address
            </button>
          </div>

          <div className="mt-10 bg-white shadow-lg rounded-xl border border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-700 font-[Playfair_Display] mb-6 border-b pb-3">
              Saved Shipping Addresses
            </h3>

            {!savedAddresses || savedAddresses.length === 0 ? (
              <p className="text-gray-500 font-[Playfair_Display]">
                No saved addresses found.
              </p>
            ) : (
              <div className="flex flex-col gap-5 w-full max-w-3xl overflow-y-auto max-h-[500px] pr-2">
                {savedAddresses.map((address) => {
                  const isSelected = selectedAddressId === address._id;

                  return (
                    <div
                      key={address._id}
                      className={`rounded-xl mt-5 p-5 border-2 shadow-sm transition-all duration-300 group hover:shadow-md relative ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {address.name}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {address.address_line_1}, {address.address_line_2}
                        </p>
                        <div>
                          {/* <input
                                                        type='radio'
                                                        onClick={() => handleSelectAddress(address._id)}
                                                        
                                                        className='absolute top-5 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow'
                                                    /> */}
                          <input
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => handleSelectAddress(address._id)}
                            className="absolute top-5 right-2 w-4 h-4 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          className={`px-4 py-2 text-sm rounded-md font-medium shadow transition-all ${
                            isSelected
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() => handleSelectAddress(address._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-map-pin-house-icon lucide-map-pin-house"
                          >
                            <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                            <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                            <path d="M18 22v-3" />
                            <circle cx="10" cy="10" r="3" />
                          </svg>
                        </button>

                        <button
                          className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 font-medium shadow"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash2-icon lucide-trash-2"
                          >
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>

                        <button
                          className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 font-medium shadow"
                          onClick={() => handleEditAddress(address)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-notebook-tabs-icon lucide-notebook-tabs"
                          >
                            <path d="M2 6h4" />
                            <path d="M2 10h4" />
                            <path d="M2 14h4" />
                            <path d="M2 18h4" />
                            <rect width="16" height="20" x="4" y="2" rx="2" />
                            <path d="M15 2v20" />
                            <path d="M15 7h5" />
                            <path d="M15 12h5" />
                            <path d="M15 17h5" />
                          </svg>
                        </button>
                      </div>

                      {isSelected && (
                        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[35%] h-fit bg-white shadow-lg rounded-xl border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
            Cart Summary
          </h3>

          {cartLoading ? (
            <p className="text-gray-600">Loading cart...</p>
          ) : cartError ? (
            <p className="text-red-600 font-medium">Error: {cartError}</p>
          ) : items && items.length > 0 ? (
            <>
              <ul className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-6 bg-gray-50 rounded-lg p-4 border border-gray-300"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:3002/uploads/${item.image}`}
                        alt={item.name}
                        className="w-[80px] h-[100px] object-cover rounded-md shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{item.price}
                      </p>
                      <p className="font-medium text-gray-800 mt-1">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="text-right mt-6 border-t pt-4">
                <p className="text-lg font-bold text-gray-900">
                  Total: ₹{calculateTotal()}
                </p>
              </div>

              <button
                onClick={() => handleCreateOrder(selectedAddressId)}
                disabled={orderLoading || paymentLoading}
                className={`mt-6 w-full font-semibold py-3 rounded-lg transition duration-300 ${
                  orderLoading || paymentLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {orderLoading
                  ? "Creating Order..."
                  : paymentLoading
                  ? "Processing Payment..."
                  : "Place Order"}
              </button>
            </>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-white font-[Playfair_Display]">
                  {selectedAddressForEdit ? "Edit Address" : "Add New Address"}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedAddressForEdit
                    ? "Update your shipping information"
                    : "Fill in your shipping details"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.fullName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.mobile && formik.errors.mobile
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your mobile number"
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formik.values.addressLine1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.addressLine1 && formik.errors.addressLine1
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter address line 1"
                  />
                  {formik.touched.addressLine1 &&
                    formik.errors.addressLine1 && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.addressLine1}
                      </div>
                    )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formik.values.addressLine2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter address line 2 (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.city && formik.errors.city
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your city"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.city}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.state && formik.errors.state
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your state"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.state}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.country && formik.errors.country
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your country"
                  />
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.country}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white hover:border-gray-400 ${
                      formik.touched.pincode && formik.errors.pincode
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your pincode"
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.pincode}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-lg py-3 rounded-lg font-semibold transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 text-lg py-3 rounded-lg font-semibold transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    }`}
                  >
                    {loading
                      ? "Submitting..."
                      : selectedAddressForEdit
                      ? "Update Address"
                      : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
