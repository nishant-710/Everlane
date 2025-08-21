import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  getCartAsync,
  increaseCartAsync,
  decreaseCartAsync,
} from "../features/trending/CartSlice";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_BASEURL_API;

  const searchParams = new URLSearchParams(location.search);
  const initialSize = searchParams.get("size") || "";
  const initialColor = searchParams.get("color") || "";

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [itemId, setItemId] = useState(null);

  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.post(`${API_URL}/user/productDetails`, {
          id,
        });
        setProduct(response?.data?.product);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCartAsync(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (product && selectedSize && selectedColor && cartItems.length) {
      const match = cartItems.find(
        (item) =>
          item.productId === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      setQuantity(match?.quantity || 0);
      setItemId(match?._id || null);
    } else {
      setQuantity(0);
      setItemId(null);
    }
  }, [product, selectedSize, selectedColor, cartItems]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedSize) params.set("size", selectedSize);
    if (selectedColor) params.set("color", selectedColor);

    const newUrl = `/product/${id}?${params.toString()}`;

    window.history.replaceState(null, "", newUrl);
  }, [selectedSize, selectedColor]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.");

      return;
    }

    const cartItem = {
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };

    if (!token) {
      const heroCart = JSON.parse(localStorage.getItem("heroCart")) || [];

      console.log("hhhd", heroCart);

      const Userexists = heroCart.find(
        (item) =>
          item.productId === cartItem.productId &&
          item.size === cartItem.size &&
          item.color === cartItem.color
      );

      if (!Userexists) {
        heroCart.push(cartItem);

        console.log("hdhkka", cartItem);

        localStorage.setItem("heroCart", JSON.stringify(heroCart));

        console.log("hero items added in cart", heroCart);

        toast.success("Item saved! Login to add it to your cart.");
      } else {
        toast.info("Item already saved.");
      }

      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/user/cart/add`, cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addToCart(cartItem));

      dispatch(getCartAsync(token));

      toast.success("Item added to cart!");
    } catch (err) {
      console.error(err);

      toast.error("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    const token = localStorage.getItem("token");

    if (!token || !itemId) return;

    dispatch(increaseCartAsync({ itemId, token }))
      .then(() => {
        setQuantity((prev) => prev + 1);

        dispatch(getCartAsync(token));
      })
      .catch(() => toast.error("Failed to increase quantity."));
  };

  const handleDecrease = async () => {
    const token = localStorage.getItem("token");

    if (!token || !itemId) return;

    dispatch(decreaseCartAsync({ itemId, token }))
      .then(() => {
        setQuantity((prev) => Math.max(prev - 1, 0));
        dispatch(getCartAsync(token));
      })
      .catch(() => toast.error("Failed to decrease quantity."));
  };

  if (error)
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  if (!product)
    return <div className="text-blue-600 text-center mt-4">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full mt-10">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={`http://localhost:3002/uploads/${product.image}`}
            alt={product.name}
            className="w-full max-w-sm object-cover aspect-square rounded"
          />
          <h1 className="text-2xl font-bold mt-4 md:hidden text-center">
            {product.name}
          </h1>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4 hidden md:block">
            {product.name}
          </h1>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-6">Brand: {product.brand}</p>

          <div className="top-2 right-2 z-10 flex space-x-1 mb-5">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < (product?.stars || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
            ))}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Select Size:</label>
            <div className="flex flex-wrap gap-2">
              {product?.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded border transition ${
                    selectedSize === size
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Select Color:</label>
            <div className="flex flex-wrap gap-2">
              {product?.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded border transition ${
                    selectedColor === color
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex">
            {quantity > 0 ? (
              <div className="flex items-center">
                <button
                  onClick={handleDecrease}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                >
                  -
                </button>
                <span className="px-4 py-2 bg-red-600 text-white hover:bg-red-700">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !selectedSize || !selectedColor}
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
