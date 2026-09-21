import { useState, memo, useCallback } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export const ServiceItem = ({ title, duration, price }) => (
    <li className="flex justify-between items-start hairline-divider pb-6">
        <div>
            <h3 className="text-[18px] text-primary mb-1 font-serif">{title}</h3>
            <p className="text-on-surface-variant">{duration} mins</p>
        </div>
        <span className="text-primary font-medium">₹ {price}</span>
    </li>
);

// export const BookingSlot = ({ date, time }) => (
//     <div className="mb-12">
//         <h2 className="text-[12px] font-medium text-outline uppercase mb-6 tracking-widest">Selected Booking Slot</h2>
//         <div className="bg-surface-container-low p-6 flex items-center gap-4 hairline-border">
//             <span className="material-symbols-outlined text-outline text-[24px]">calendar_today</span>
//             <div>
//                 <p className="text-[18px] text-primary font-serif font-medium">{date}</p>
//                 <p className="text-on-surface-variant">{time}</p>
//             </div>
//         </div>
//     </div>
// );

export const CostBreakdown = ({ subtotal, tax, total }) => (
    <div className="mb-12">
        <div className="space-y-4 pt-6">
            <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>{subtotal}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
                <span>Taxes & Fees</span>
                <span>{tax}</span>
            </div>
            <div className="flex justify-between pt-6 mt-6 hairline-divider-top">
                <span className="text-[24px] font-serif font-medium text-primary-container">Total Amount</span>
                <span className="text-[24px] font-serif font-medium text-primary-container">{total}</span>
            </div>
        </div>
    </div>
);


/* ==========================================================================
   TIME CONFIGURATION SETTINGS
   ========================================================================== */
const START_HOUR = 9;        // 9 AM
const END_HOUR = 21;        // 9 PM
const INTERVAL_MINUTES = 60; // 1-hour intervals

const TIME_SLOTS = (() => {
    const slots = [];
    let current = START_HOUR * 60;
    const end = END_HOUR * 60;

    while (current <= end) {
        const h24 = Math.floor(current / 60);
        const m = current % 60;
        const period = h24 >= 12 ? 'PM' : 'AM';
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        slots.push(`${h12}:${m.toString().padStart(2, '0')} ${period}`);
        current += INTERVAL_MINUTES;
    }
    return slots;
})();

export const BookingSlot = memo(({
    date = new Date().toISOString().split('T')[0], // format: "YYYY-MM-DD"
    onDateChange,
    time = "2:00 PM",
    onTimeChange,
    disabled = false
}) => {
    return (
        <div className="mb-12">
            <h2 className="text-[12px] font-medium text-outline uppercase mb-6 tracking-widest">
                Selected Booking Slot
            </h2>

            <div className="bg-surface-container-low p-6 flex items-center gap-4 hairline-border">
                {/* Calendar Icon */}
                <span className="material-symbols-outlined text-outline text-[24px] select-none">
                    calendar_today
                </span>

                <div className="flex-1 flex flex-col gap-1">
                    {/* Native Date Input */}
                    <input
                        type="date"
                        value={date}
                        disabled={disabled}
                        onChange={(e) => onDateChange && onDateChange(e.target.value)}
                        className="bg-transparent text-[18px] text-primary font-serif font-medium border-none outline-none cursor-pointer w-full p-0"
                    />

                    {/* Time Slot Dropdown */}
                    <div className="relative inline-block">
                        <select
                            value={time}
                            disabled={disabled}
                            onChange={(e) => onTimeChange && onTimeChange(e.target.value)}
                            className="bg-transparent text-[14px] text-on-surface-variant font-sans border-none outline-none cursor-pointer pr-5 appearance-none hover:text-primary transition-colors"
                        >
                            {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot} className="bg-[#f7f4ee] text-primary">
                                    {slot}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined text-outline text-[14px] pointer-events-none -ml-4 align-middle">
                            expand_more
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

BookingSlot.displayName = 'BookingSlot';