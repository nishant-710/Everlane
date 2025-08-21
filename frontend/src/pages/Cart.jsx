import React from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import img11 from "../images/img11.png";

const Cart = () => {
  const navigate = useNavigate();

  const { items, totalCount, error, add, remove } = useCart();

  console.log({ items });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-5 text-center">Your Cart</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src={img11} alt="cart" className="w-48 h-48 mb-4" />
          <p className="text-lg font-semibold">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 font-[Playfair_Display]">
            {items.map((item) => (
              <div
                key={item?._id}
                className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-6 gap-4"
              >
                <div className="md:w-1/3 text-center md:text-left">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <img
                    src={`http://localhost:3002/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded"
                  />
                </div>

                <div className="md:w-1/3 text-center md:text-left space-y-1">
                  <p className="text-md">Price: ₹{item.price}</p>
                  <p className="text-md">Size: {item.size}</p>
                  <p className="text-md">Color: {item.color}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>

                <div className="md:w-1/3 flex justify-center md:justify-end items-center">
                  <button
                    onClick={() => add(item)}
                    className="bg-red-700 text-white py-1 px-3 hover:bg-red-800 rounded-l text-sm"
                  >
                    +
                  </button>
                  <span className="bg-red-700 text-white px-3 py-1 text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => remove(item)}
                    className="bg-red-700 text-white py-1 px-3 hover:bg-red-800 rounded-r text-sm"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center md:text-right font-semibold text-lg">
            Total Items: {totalCount}
          </div>

          <div className="flex justify-center md:justify-end mt-4">
            <button
              className="bg-orange-500 px-5 py-2 rounded-[10px] text-white font-[Playfair_Display] hover:bg-orange-600 transition"
              onClick={() =>
                navigate("/checkout", { state: { cartItems: items } })
              }
            >
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
