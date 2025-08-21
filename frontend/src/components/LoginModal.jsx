import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../features/trending/authSlice.js";
import { addToCart, getCartAsync } from "../features/trending/CartSlice";
import axios from "axios";
import { toast } from "react-toastify";

const LoginModal = ({ visible, onClose }) => {
 
  const dispatch = useDispatch();

  const { error, loading, user } = useSelector((state) => state.auth);

  const API_URL = import.meta.env.VITE_BASEURL_API;

  const heroCartToServer = async (token) => {

    const heroCart = JSON.parse(localStorage.getItem("heroCart")) || [];

    console.log("hero Cart items",heroCart);

    if (heroCart.length === 0) return;

    try {
      
      for (const item of heroCart) {
      
        await axios.post(`${API_URL}/user/cart/add`, item, {
      
          headers: {
      
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(addToCart(item)); 
      
      }

      console.log("hero items",heroCart);

      localStorage.removeItem("heroCart");
    
      dispatch(getCartAsync(token));
    
      toast.success("Hero cart synced!");
    
    } catch (err) {
    
      console.error("Failed to sync Hero cart:", err);

      toast.error("Error syncing Hero cart.");
    }
};

  useEffect(() => {

    if (user?.token) {
      
      localStorage.setItem("token", user?.token);

      heroCartToServer(user?.token).finally(() => {

        onClose();
      });
    }
  }, [user, onClose]);

  const formik = useFormik({

    initialValues: {
     
      email: "",
      password: "",
    
    },

    validationSchema: Yup.object({
    
      email: Yup.string().email("Invalid email").required("Email is required"),
    
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      }),

      onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-8 py-6 space-y-6">
         
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full pl-3 pr-3 py-3 border ${
                  formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full pl-3 pr-3 py-3 border ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
