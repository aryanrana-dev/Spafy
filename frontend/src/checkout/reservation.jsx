import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceItem, BookingSlot, CostBreakdown } from "./helper";
import { handlePayment } from "../pages/Razorpay";
import { useAuthStore } from "../stores/auth-store";
import { useServicesStore } from "../stores/services-store";

export default function ReservationCard({ selectedServices }) {
  const navigate = useNavigate();
  // Default date to tomorrow so appointment is always in the future
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [time, setTime] = useState('2:00 PM');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedData, setConfirmedData] = useState(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const resetCart = useServicesStore((state) => state.reset);

  const total = selectedServices?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;

  const onProceedPayment = async () => {
    if (!isAuthenticated) {
      navigate('/salon/login');
      return;
    }

    if (!selectedServices || selectedServices.length === 0) {
      setError("Please add at least one service to your cart.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the refund policy and terms to proceed.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parse date and time into valid future ISO strings
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const appointmentDateObj = new Date(date);
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes || 0, 0, 0);

      if (startDateTime <= new Date()) {
        setError("Appointment time must be in the future. Please select a future date or time.");
        setLoading(false);
        return;
      }

      const primaryService = selectedServices[0];
      const salonId = primaryService.salonId || "6a78d04628dd221b27bfa3ae";
      const salonServiceId = primaryService._id || primaryService.id;

      await handlePayment({
        amount: total,
        bookingDetails: {
          salonId,
          salonServiceId,
          appointmentDate: appointmentDateObj.toISOString(),
          startTime: startDateTime.toISOString()
        },
        user,
        onSuccess: (data) => {
          setLoading(false);
          setConfirmedData(data);
          resetCart();
        },
        onError: (errMessage) => {
          setLoading(false);
          setError(errMessage);
        }
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to process payment");
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedData) {
    return (
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white p-12 md:p-16 hairline-border relative text-center">
          <div className="corner-accent top-l"></div>
          <div className="corner-accent top-r"></div>
          <div className="corner-accent bot-l"></div>
          <div className="corner-accent bot-r"></div>

          <div className="w-16 h-16 bg-[#51625e]/10 text-[#51625e] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>

          <h1 className="font-headline-lg text-[28px] md:text-[32px] text-primary mb-2">
            Reservation Confirmed!
          </h1>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
            Thank you, {user?.fullName || user?.name || "Client"}! Your appointment has been secured and confirmed in our system.
          </p>

          <div className="bg-[#fbf9f4] p-6 rounded-lg text-left max-w-md mx-auto mb-8 space-y-3 hairline-border">
            <div className="flex justify-between text-sm">
              <span className="text-outline uppercase text-[11px] tracking-wider font-medium">Booking ID</span>
              <span className="font-mono text-primary text-xs font-semibold">{confirmedData.booking?._id || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-outline uppercase text-[11px] tracking-wider font-medium">Date & Time</span>
              <span className="text-primary font-medium">{date} at {time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-outline uppercase text-[11px] tracking-wider font-medium">Payment Status</span>
              <span className="text-emerald-700 font-medium">Paid (Razorpay)</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-outline-variant/30">
              <span className="text-outline uppercase text-[11px] tracking-wider font-medium">Total Paid</span>
              <span className="text-primary font-semibold">₹{total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/salon/spafy")}
              className="bg-primary-container text-white px-8 py-3 text-[13px] font-medium uppercase tracking-widest hover:bg-tertiary-container transition-colors cursor-pointer"
            >
              Book Another Service
            </button>
            {user?.role === "admin" ? (
              <button
                onClick={() => navigate(`/${user?.salonSlug || "spafy"}/dashboard`)}
                className="bg-transparent border border-outline px-8 py-3 text-[13px] font-medium uppercase tracking-widest text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/salon/bookings")}
                className="bg-transparent border border-outline px-8 py-3 text-[13px] font-medium uppercase tracking-widest text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                View Your Bookings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (!selectedServices || selectedServices.length === 0) {
    return (
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white p-16 hairline-border relative text-center">
          <div className="corner-accent top-l"></div>
          <div className="corner-accent top-r"></div>
          <div className="corner-accent bot-l"></div>
          <div className="corner-accent bot-r"></div>

          <span className="material-symbols-outlined text-5xl text-outline mb-4">shopping_bag</span>
          <h2 className="font-headline-lg text-[26px] text-primary mb-2">Your Cart is Empty</h2>
          <p className="text-on-surface-variant mb-8">Select one or more services to proceed with reservation.</p>

          <button
            onClick={() => navigate("/salon/spafy")}
            className="bg-primary-container text-white px-8 py-3 text-[13px] font-medium uppercase tracking-widest hover:bg-tertiary-container transition-colors cursor-pointer"
          >
            Explore Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 md:p-16 hairline-border relative">
        {/* Decorative Corner Accents */}
        <div className="corner-accent top-l"></div>
        <div className="corner-accent top-r"></div>
        <div className="corner-accent bot-l"></div>
        <div className="corner-accent bot-r"></div>

        <div className="text-center mb-10">
          <h1 className="font-headline-lg text-[28px] md:text-[32px] text-primary mb-2">Reservation Summary</h1>
          <p className="text-on-surface-variant">Review your selections before finalizing your booking.</p>
          {user && (
            <p className="text-xs text-[#51625e] mt-2 font-medium">
              Booking for: {user.fullName || user.name} ({user.email})
            </p>
          )}
        </div>

        {error && (
          <div className="mb-8 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
            {error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-[12px] font-medium text-outline uppercase mb-6 tracking-widest">Selected Services</h2>
          <ul className="space-y-4">
            {selectedServices.map((service) => (
              <ServiceItem
                key={service._id || service.id || service.title}
                title={service.title || service.name}
                duration={service.duration || 45}
                price={service.price}
              />
            ))}
          </ul>
        </section>

        <BookingSlot
          date={date}
          onDateChange={setDate}
          time={time}
          onTimeChange={setTime}
        />

        <CostBreakdown subtotal={`₹${total}`} tax="₹0" total={`₹${total}`} />

        <div className="mt-10 flex flex-col items-center text-center">
          <label className="flex items-start gap-3 mb-6 cursor-pointer max-w-md text-left">
            <input
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded text-primary-container focus:ring-primary-container border-outline h-5 w-5 cursor-pointer"
              type="checkbox"
            />
            <span className="text-[14px] text-on-surface-variant leading-snug">
              By selecting the checkbox you agree to the refund policy and appointment terms & conditions.
            </span>
          </label>

          <button
            onClick={onProceedPayment}
            disabled={loading}
            className="bg-primary-container text-white w-full md:w-auto px-12 py-4 text-[14px] font-medium uppercase tracking-widest hover:bg-tertiary-container transition-colors duration-300 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Preparing Reservation..." : "Proceed to Payment"}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-outline">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-[10px] uppercase tracking-wider">Secured by Razorpay Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}