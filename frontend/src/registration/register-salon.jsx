import { useState } from 'react';
import Header from '../services-page/header';
import './register-salon.css';

const RegisterSalon = () => {
    const [hours, setHours] = useState({
        Monday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Tuesday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Wednesday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Thursday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Friday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Saturday: { open: true, start: "09:00 AM", end: "07:00 PM" },
        Sunday: { open: false, start: "09:00 AM", end: "07:00 PM" },
    });

    const handleToggle = (day) => {
        setHours(prev => ({
            ...prev,
            [day]: { ...prev[day], open: !prev[day].open }
        }));
    };

    return (
        <div className="register-page">
            <Header />

            {/* Main Content */}
            <main className="main-container">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-display text-headline-display text-primary mb-4">Register Your Salon</h1>
                        <p className="text-on-surface-variant">Join our curated collection of luxury wellness destinations.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Business Details */}
                        <section className="form-card">
                            <div className="decorative-glow"></div>
                            <h2 className="font-display text-headline-md text-primary mb-8 border-b pb-4">Business Details</h2>
                            <div className="grid gap-8">
                                <InputGroup label="Salon Name" placeholder="e.g. The Retreat Spa" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup label="Owner Name" placeholder="Full Name" />
                                    <InputGroup label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                        </section>

                        {/* Location */}
                        <section className="form-card">
                            <h2 className="font-display text-headline-md text-primary mb-8 border-b pb-4">Location</h2>
                            <div className="grid gap-8">
                                <InputGroup label="Street Address" placeholder="123 Wellness Blvd, Suite 100" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputGroup label="City" placeholder="Beverly Hills" />
                                    <InputGroup label="Postal Code" placeholder="90210" />
                                </div>
                            </div>
                        </section>

                        {/* Business Hours */}
                        <section className="form-card">
                            <h2 className="font-display text-headline-md text-primary mb-8 border-b pb-4">Business Hours</h2>
                            <div className="space-y-4">
                                {Object.keys(hours).map((day) => (
                                    <div key={day} className="flex-between py-2 border-b-subtle">
                                        <div className="flex-center gap-6 w-1/3">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={hours[day].open}
                                                    onChange={() => handleToggle(day)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="font-medium text-primary"> {day}</span>
                                        </div>

                                        <div className={`flex-1 flex justify-end items-center gap-4 ${!hours[day].open ? 'hidden' : ''}`}>
                                            <input type="text" className="hour-input" defaultValue={hours[day].start} />
                                            <span className="text-outline-variant">-</span>
                                            <input type="text" className="hour-input" defaultValue={hours[day].end} />
                                        </div>

                                        {!hours[day].open && (
                                            <div className="flex-1 flex justify-end">
                                                <span className="closed-badge">Closed</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Footer Actions */}
                        <div class="pt-8">
                            <button class="w-full bg-primary-container text-on-primary-container hover:opacity-90 font-label-md text-body-lg uppercase tracking-widest py-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-sm hover:shadow-md border border-primary/10" type="submit">
                                Complete Registration
                            </button>
                            <p class="text-center mt-6 text-label-sm text-outline font-body-md">By registering, you agree to Spafy's <a class="underline hover:text-primary transition-colors" href="#">Terms of Service</a> and <a class="underline hover:text-primary transition-colors" href="#">Privacy Policy</a>.</p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

/* Internal Helper Components */
const InputGroup = ({ label, type = "text", placeholder }) => (
    <div className="flex flex-col">
        <label className="label-md text-on-surface-variant mb-1">{label}</label>
        <input type={type} className="input-minimal" placeholder={placeholder} />
    </div>
);

export default RegisterSalon;