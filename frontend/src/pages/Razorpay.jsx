import React from 'react'
import axios from 'axios'


const Razorpay = () => {
  
    
 const handlePayment = async ()=>{
    const {data} = await axios.post("http://localhost:8080/api/payment/create-order",
    {
      amount :500,
    }
  
  );
  const options = {
    key:"rzp_test_TGc3Q4qgyG4YH8",
    amount:data.amount,
    currency:data.currency,
    order_id:data.id,
    handler:function(response){
      alert("payment succesfull");
      console.log(response);
    }
  }
  const rzp = new window.Razorpay(options);
  rzp.open();

 }
  return (
    <div>
      <button onClick={handlePayment} className='border'>Pay now</button>
    </div>
  )
    
  
       }
      

export default Razorpay
