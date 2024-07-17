import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from "@mui/material/colors";
import { getOrderDetails } from "../component/State/Order/Action";
import { getWarrantyByOrderId } from "../component/State/Warranty/Action";

export const PayMentSuccess = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const orderDetails = useSelector((state) => state.order.order);
    const warrantyDetails = useSelector((state) => state.warranty.warranty);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderDetails(orderId));
            dispatch(getWarrantyByOrderId(orderId, jwt));
        }
    }, [orderId, dispatch, jwt]);

    const handleNavigateHome = () => {
        navigate("/cart");
    };

    return (
        <div className="min-h-screen px-5 bg-gray-100">
            <div className="flex flex-col items-center justify-center h-[100vh]">
                <div className="box w-full lg:w-2/3 flex flex-col items-center rounded-md border border-gray-200 p-4 shadow-md">
                    <CheckCircleIcon sx={{ fontSize: "4rem", color: green[500] }} />
                    <h1 className="py-4 text-2xl font-semibold">SUCCESS</h1>
                    <p className="font-bold text-center mb-4">Thank you for choosing our Jewelry Store!</p>

                    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-100 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-xl mb-2">Order Invoice</h2>
                            {orderDetails ? (
                                <div>
                                    <p>Order ID: {orderDetails.id}</p>
                                    <p>Customer Name: {orderDetails.customer.fullname}</p>
                                    <p>Mobile: {orderDetails.customer.mobile}</p>
                                    <p>Email: {orderDetails.customer.email}</p>
                                    <p> {orderDetails.description}</p>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>

                        <div className="bg-green-100 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-xl mb-2">Items</h2>
                            {orderDetails ? (
                                <div>
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="mb-2">
                                            <p>Jewelry: {item.jewelry.name}</p>
                                            <p>Product Code: {item.jewelry.code}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: {item.jewelry.price}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>

                        <div className="bg-green-100 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-xl mb-2">Total Summary</h2>
                            {orderDetails ? (
                                <div>
                                    <p>Total Amount: {orderDetails.totalAmount}</p>
                                    <p>Discount: {orderDetails.items[0].discountPercentage}% on entire bill</p>
                                    <p>Promotions exclusively for loyal customers: {orderDetails.detail}</p>
                                    <p>Total Pay: {orderDetails.totalPrice}</p>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>

                        {warrantyDetails && (
                            <div className="bg-green-100 border border-gray-300 p-4 rounded-md">
                                <h2 className="text-xl mb-2">Warranty</h2>
                                <div>
                                    <p>Warranty ID: {warrantyDetails.id}</p>
                                    <p>Warranty Terms: {warrantyDetails.terms}</p>
                                    <p>Start Date: {warrantyDetails.startDate}</p>
                                    <p>End Date: {warrantyDetails.endDate}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleNavigateHome}
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            bgcolor: 'orange',
                            color: 'white',
                            fontWeight: 'bold',
                            height: '40px',
                            padding: '8px',
                            '&:hover': {
                              bgcolor: 'darkorange',
                            },
                            '&:focus': {
                              bgcolor: 'black',
                            },
                        }}
                    >
                        Go To Home
                    </Button>
                </div>
            </div>
        </div>
    );
};
