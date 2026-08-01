export const ServiceItem = ({ title, duration, price }) => (
    <li className="flex justify-between items-start hairline-divider pb-6">
        <div>
            <h3 className="text-[18px] text-primary mb-1 font-serif">{title}</h3>
            <p className="text-on-surface-variant">{duration}</p>
        </div>
        <span className="text-primary font-medium">{price}</span>
    </li>
);

export const BookingSlot = ({ date, time }) => (
    <div className="mb-12">
        <h2 className="text-[12px] font-medium text-outline uppercase mb-6 tracking-widest">Selected Booking Slot</h2>
        <div className="bg-surface-container-low p-6 flex items-center gap-4 hairline-border">
            <span className="material-symbols-outlined text-outline text-[24px]">calendar_today</span>
            <div>
                <p className="text-[18px] text-primary font-serif font-medium">{date}</p>
                <p className="text-on-surface-variant">{time}</p>
            </div>
        </div>
    </div>
);

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