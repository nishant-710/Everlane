import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchUserOrders } from '../features/trending/authSlice';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_BASEURL_API;

const OrderDetails = () => {

    const dispatch = useDispatch();
    const { orders, ordersLoading, error } = useSelector((state) => state.auth);

    const [ratings, setRatings] = useState({});

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    useEffect(() => {

        const fetchRatings = async () => {
        
            const token = localStorage.getItem('token');
        
            if (!token || !orders.length) return;

            const ratingsMap = {};

            for (const order of orders) {

                for (const item of order.items) {
                    try {
                
                        const res = await axios.post(`${API_URL}/user/ratings`, {
                            productId: item.productId,
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        ratingsMap[item.productId] = res.data.stars;
                    } catch (e) {
                        console.error(`Failed to fetch rating for ${item.productId}`, e);
                    }
                }
            }

            setRatings(ratingsMap);
        };

        fetchRatings();
    
    }, [orders]);


    const handleRating = async (value, productId) => {

        const token = localStorage.getItem('token');

        if (!token || !productId) {
            toast.error('You must be logged in to rate.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/user/ratings`, {
                
                productId,
                stars: value
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Thanks for your rating!');

            setRatings((prev) => ({ ...prev, [productId]: response.data.stars }));

        } catch (error) {

            toast.error('Failed to submit rating.');
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

            {ordersLoading && <p className="text-gray-600">Loading orders...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!ordersLoading && orders.length === 0 && <p>No orders found.</p>}

            {orders?.map((order) => (

                <div key={order._id} className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                    <div className="mb-2">
                        <span className="font-medium">Order ID:</span> {order._id}
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Amount:</span> ₹{order.amount}
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`inline-block px-2 py-1 rounded text-white text-xs ${order.status === 'paid' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Razorpay Order ID:</span> {order.razorpay_order_id}
                    </div>
                    <div className="mb-2">
                        <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}
                    </div>

                    <h3 className="font-semibold mt-4 mb-2">Items:</h3>
                    <ul className="space-y-2">
                        {order.items.map((item) => (
                            <li key={item._id} className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between">
                                    <div>
                                        <div><strong>Product Name:</strong> {item.productName}</div>
                                        <div><strong>Quantity:</strong> {item.quantity}</div>
                                    </div>
                                    <div className="font-bold">₹{item.price}</div>
                                </div>

                                <div className="flex items-center space-x-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <svg
                                            key={value}
                                            onClick={() => handleRating(value, item.productId)}
                                            className={`w-5 h-5 cursor-pointer ${value <= (ratings[item.productId] || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                        </svg>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default OrderDetails;
