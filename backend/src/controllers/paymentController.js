import Razorpay from "razorpay"
import dotenv from "dotenv"
dotenv.config()


const razorpay = new Razorpay({
    key_id:process.env.Test_Api_Key,
    key_secret:process.env.Test_Api_Secret_Key
})
export const paymentController = async(req,res)=>{
try{
    const options={
        amount:req.body.amount*100,
        currency:"INR",
        receipt:"receipt_" + Date.now()
    }
    const order = await razorpay.orders.create(options);
    res.status(200).json(order)

}
catch(err){
    res.status(500).json({
        message:"Failed to create order",
        err:err.message
    })
}
}