"use client";

import React, { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}


const PaymentPage = () => {
  const AMOUNT = 100; // Constant amount in INR
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create Order
      const response = await fetch("/api/create-order", {method: "POST"});
      const data = await response.json();

      //initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "SaaScraft",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          console.log("Payment Successful ✅", response);
          //Handler successful payment (e.g. update UI, send to server)
        },
        prefill: {
          name: "Asif Jamal",
          email: "asifsaascraft@example.com",
          contact: "9",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return  (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="p-66 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold md-4">Payment Page</h1>
        <p className="mb-4">Amount to pay: {AMOUNT} INR</p>
        <button
           onClick={handlePayment}
           disabled={isProcessing}
           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 