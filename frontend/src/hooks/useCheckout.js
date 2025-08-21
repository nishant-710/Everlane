import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import {
    submitShippingDetails,
    editShippingDetails,
    resetShippingStatus,
    getCartAsync,
    ListShippingDetails,
    deleteShippingDetails,
    SavedSelectedAddressDetails,
    createOrder,
    verifyPayment,
    resetOrderStatus,
    resetPaymentStatus,
} from '../features/trending/shippingSlice.js';

const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required').min(2).max(50),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits').required('Mobile number is required'),
    addressLine1: Yup.string().required('Address line 1 is required').min(5),
    addressLine2: Yup.string(),
    city: Yup.string().required('City is required').min(2),
    state: Yup.string().required('State is required').min(2),
    country: Yup.string().required('Country is required').min(2),
    pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').required('Pincode is required'),
});

export const useCheckout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddressForEdit, setSelectedAddressForEdit] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        loading,
        success,
        error,
        items,
        cartLoading,
        cartError,
        savedAddresses,
        selectedAddressId,
        orderLoading,
        orderSuccess,
        orderError,
        orderData,
        paymentLoading,
        paymentSuccess,
        paymentError,
        paymentData,
    } = useSelector((state) => state.shipping);

    const selectedAddress = savedAddresses?.find((d) => d._id === selectedAddressId);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            mobile: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            country: '',
            state: '',
            pincode: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                name: values.fullName,
                email: values.email,
                mobile: values.mobile,
                address_line_1: values.addressLine1,
                address_line_2: values.addressLine2,
                city: values.city,
                state: values.state,
                country: values.country,
                pincode: values.pincode,
            };

            localStorage.setItem('shipping_details', JSON.stringify(payload));

            if (selectedAddressForEdit) {
                dispatch(editShippingDetails({ id: selectedAddressForEdit._id, payload }));
            } else {
                dispatch(submitShippingDetails(payload));
            }

            setIsModalOpen(false);
        },
    });

    useEffect(() => {
       
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(getCartAsync(token));
            dispatch(ListShippingDetails());
        } else {
            toast.warn('No token found. Unable to fetch cart.');
        }
    }, [dispatch]);

    useEffect(() => {
      
        const storedAddressId = localStorage.getItem('selected_address_id');
        const isValidStoredId = savedAddresses?.some(addr => addr._id === storedAddressId);

        if (
            savedAddresses?.length > 0 &&
            (!selectedAddressId || !savedAddresses.some(addr => addr._id === selectedAddressId))
        ) {
            const defaultId = isValidStoredId ? storedAddressId : savedAddresses[0]._id;
            dispatch(SavedSelectedAddressDetails(defaultId));
        }
    }, [savedAddresses, selectedAddressId, dispatch]);

    useEffect(() => {
      
        if (success) {
            toast.success('Details submitted!');
            const token = localStorage.getItem('token');
            if (token) dispatch(getCartAsync(token));
            dispatch(ListShippingDetails());
            dispatch(resetShippingStatus());

            formik.resetForm();
            setSelectedAddressForEdit(null);
        }

        if (error) {
            toast.error('Submission failed: ' + error);
        }
    }, [success, error, dispatch, formik]);

    useEffect(() => {
        if (orderSuccess && orderData) {
            const { order_id, amount, currency, key_id } = orderData;

            const options = {
                key: key_id,
                amount: amount * 100,
                currency,
                name: "EVERLANE",
                description: "Complete your order",
                order_id,

                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    dispatch(verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }));
                },
                prefill: {
                    name: selectedAddress?.name || "",
                    email: selectedAddress?.email || "",
                    contact: "9876543210" || selectedAddress?.mobile,
                },
                theme: {
                    color: "#ff6b00",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            dispatch(resetOrderStatus());
        }

        if (orderError) {
            toast.error("Order creation failed: " + orderError);
            dispatch(resetOrderStatus());
        }
    }, [orderSuccess, orderError, orderData, dispatch, selectedAddress]);

    useEffect(() => {
        if (paymentSuccess && paymentData) {
            if (paymentData.success) {
                toast.success("Payment successful! Order placed.");
                navigate('/myOrders');
            } else {
                toast.error("Payment verification failed.");
            }
            dispatch(resetPaymentStatus());
        }

        if (paymentError) {
            toast.error("Payment verification failed: " + paymentError);
            dispatch(resetPaymentStatus());
        }
    }, [paymentSuccess, paymentError, paymentData, dispatch, navigate]);

    const clearForm = () => {
        formik.resetForm();
        setSelectedAddressForEdit(null);
    };

    const populateForm = (address) => {
        
        formik.setValues({
            fullName: address.name || '',
            email: address.email || '',
            mobile: address.mobile || '',
            addressLine1: address.address_line_1 || '',
            addressLine2: address.address_line_2 || '',
            city: address.city || '',
            state: address.state || '',
            country: address.country || '',
            pincode: address.pincode || '',
        });
    };

    const handleDeleteAddress = (_id) => {
        dispatch(deleteShippingDetails(_id));
        toast.success("Address deleted", {
            position: "bottom-right",
            autoClose: 2000,
        });

        if (_id === selectedAddressId) {
            localStorage.removeItem('selected_address_id');
        }
    };

    const handleSelectAddress = (_id) => {
       
        if (selectedAddressId !== _id) {
            localStorage.setItem('selected_address_id', _id);
            dispatch(SavedSelectedAddressDetails(_id));
            toast.success("Address selected successfully!", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                pauseOnHover: true,
                theme: "light",
            });
        }
    };

    const handleEditAddress = (address) => {
        populateForm(address);
        setSelectedAddressForEdit(address);
        setIsModalOpen(true);
    };

    const handleAddNewAddress = () => {
        clearForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        clearForm();
    };

    const handleCreateOrder = (selectedAddressId) => {
       
        if (!selectedAddressId) {
            toast.warn("Please select an address before placing order.");
            return;
        }
        dispatch(createOrder(selectedAddressId));
    };

    const calculateTotal = () => {
        return items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    };

    return {
        formik,
        isModalOpen,
        selectedAddressForEdit,
        loading,
        success,
        error,
        items,
        cartLoading,
        cartError,
        savedAddresses,
        selectedAddressId,
        selectedAddress,
        orderLoading,
        orderSuccess,
        orderError,
        orderData,
        paymentLoading,
        paymentSuccess,
        paymentError,
        paymentData,
        handleDeleteAddress,
        handleSelectAddress,
        handleEditAddress,
        handleAddNewAddress,
        handleCloseModal,
        handleCreateOrder,
        clearForm,
        populateForm,
        calculateTotal,
    };
};
