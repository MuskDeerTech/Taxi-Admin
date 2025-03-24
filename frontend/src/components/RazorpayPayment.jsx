import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RazorpayPayment = () => {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Simulated user data (replace with actual auth data)
  const userEmail = "user@example.com"; // Fetch from auth context or session
  const rideId = "ride_456"; // Fetch from ride booking context

  const handlePayment = async () => {
    const amountValue = parseInt(amount);
    if (!amountValue || amountValue <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    try {
      const { data } = await axios.post("http://157.245.101.161:5000/create-order", { amount: amountValue });
      setOrderId(data.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Updated for Vite
        amount: data.amount,
        currency: "INR",
        name: "Car Taxi Service",
        description: "Taxi Booking Payment",
        order_id: data.id,
        handler: async (response) => {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userEmail,
            rideId,
          };
          const verifyRes = await axios.post("http://157.245.101.161:5000/verify-payment", verifyData);
          if (verifyRes.data.success) {
            setPaymentStatus("Payment Successful!");
            toast.success("Payment Successful!");
          } else {
            setPaymentStatus("Payment Verification Failed");
            toast.error("Payment Verification Failed");
          }
        },
        theme: { color: "#528FF0" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Payment failed: " + error.message);
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    // Remove duplicate script loading (already in index.html)
    // Optionally, you can keep this if you prefer dynamic loading
  }, []);

  return (
    <div>
      <h2>Pay for Your Ride</h2>
      <input
        type="number"
        placeholder="Enter Amount in INR"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
      />
      <button onClick={handlePayment} disabled={!amount}>Pay Now</button>
      {orderId && <p>Order ID: {orderId}</p>}
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default RazorpayPayment;