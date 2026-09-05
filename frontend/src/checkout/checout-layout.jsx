import Footer from "./footer";
import ReservationCard from "./reservation";
import './checkout-layout.css';
import { useServicesStore } from "../stores/services-store";

export default function CheckoutLayout() {
    const selectedServices = useServicesStore((state) => state.services);
    return (
        <div className="min-h-screen">
            <ReservationCard selectedServices={selectedServices} />
            <Footer />
        </div>
    )
}