import React from 'react'
import axios from 'axios'

export const handlePayment = async () => {
  const { data } = await axios.post("http://localhost:8080/api/payment/create-order", { amount: 500, });
  const options = {
    key: import.meta.env.Vite_Razorpay_Key,
    amount: data.amount,
    currency: data.currency,
    order_id: data.id,
    handler: function (response) {
      alert("payment succesfull");
      console.log(response);
    }
  }
  const rzp = new window.Razorpay(options);
  rzp.open();
}

