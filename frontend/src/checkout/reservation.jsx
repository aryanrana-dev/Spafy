import { useState } from "react";
import { ServiceItem, BookingSlot, CostBreakdown } from "./helper"
import { handlePayment } from "../pages/Razorpay"
import { useCheckoutStore } from "../stores/checkout-store";

export default function ReservationCard({ selectedServices }) {
  const [date, setDate] = useState('2026-10-26');
  const [time, setTime] = useState('2:00 PM');

  const userInfo = useCheckoutStore((state) => state.userInfo);
  const getTotal = useCheckoutStore((state) => state.getTotal);
  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="bg-white p-16 hairline-border relative">
        {/* Decorative Corner Accents */}
        <div className="corner-accent top-l"></div>
        <div className="corner-accent top-r"></div>
        <div className="corner-accent bot-l"></div>
        <div className="corner-accent bot-r"></div>

        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-[32px] text-primary mb-4">Reservation Summary</h1>
          <p className="text-on-surface-variant">Review your selections before finalizing your booking.</p>
        </div>

        <section className="mb-12">
          <h2 className="text-[12px] font-medium text-outline uppercase mb-6 tracking-widest">Selected Services</h2>
          <ul className="space-y-6">
            {selectedServices?.length > 0 && selectedServices.map((service) => (
              <ServiceItem key={service._id} title={service.title} duration={service.duration} price={service.price} />
            ))}
          </ul>
        </section>

        <BookingSlot
          date={date}
          onDateChange={setDate}
          time={time}
          onTimeChange={setTime}
        />

        <CostBreakdown subtotal={getTotal()} tax={0} total={getTotal()} />

        <div className="mt-12 flex flex-col items-center text-center">
          <label className="flex items-start gap-3 mb-8 cursor-pointer max-w-md text-left">
            <input className="mt-1 rounded text-primary-container focus:ring-primary-container border-outline h-5 w-5" type="checkbox" />
            <span className="text-[16px] text-[#9CAEA9] leading-snug">
              By selecting the checkbox you agree to the refund policy and terms and conditions.
            </span>
          </label>
          <button onClick={handlePayment} className="bg-primary-container text-white w-full md:w-auto px-12 py-4 text-[14px] font-medium uppercase tracking-widest hover:bg-tertiary-container transition-colors duration-300">
            Click here to go to payments
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-outline">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-[10px] uppercase tracking-wider">SECURE REDIRECTION</span>
          </div>
        </div>
      </div>
    </div>
  )
}