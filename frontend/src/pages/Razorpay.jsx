import api from '../api/axiosClient';

export const handlePayment = async ({
    amount,
    bookingDetails,
    user,
    onSuccess,
    onError
}) => {
    try {
        // 1. Create booking in backend DB
        const bookingRes = await api.post("/user/booking/book", bookingDetails);
        const booking = bookingRes.data?.booking;

        // 2. Create Razorpay order
        const { data: order } = await api.post("/payment/create-order", { amount });

        // 3. Configure Razorpay modal
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency || "INR",
            name: "Spafy Wellness",
            description: "Salon Service Appointment",
            order_id: order.id,
            prefill: {
                name: user?.fullName || user?.name || "Client",
                email: user?.email || "client@example.com",
                contact: user?.phone || "9999999999"
            },
            theme: {
                color: "#4a3b32"
            },
            handler: async function (response) {
                try {
                    // 4. Verify payment and confirm booking in DB
                    const verifyRes = await api.post("/payment/verify", {
                        bookingId: booking?._id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        amount: amount
                    });

                    if (onSuccess) {
                        onSuccess({
                            booking,
                            payment: verifyRes.data?.payment,
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id
                        });
                    }
                } catch (verifyError) {
                    console.error("Payment verification failed", verifyError);
                    if (onError) onError("Payment completed with Razorpay but backend update failed.");
                }
            },
            modal: {
                ondismiss: function () {
                    if (onError) onError("Payment modal closed.");
                }
            }
        };

        if (!window.Razorpay) {
            throw new Error("Razorpay SDK not loaded. Please refresh the page.");
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failResponse) {
            if (onError) onError(failResponse.error?.description || "Payment failed");
        });
        rzp.open();
    } catch (err) {
        console.error("Checkout error:", err);
        const message = err.response?.data?.message || err.message || "Failed to initiate payment";
        if (onError) onError(message);
    }
};

