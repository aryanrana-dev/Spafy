import Footer from "./footer";
import ReservationCard from "./reservation";
import './checkout-layout.css';

export default function CheckoutLayout() {
    return (
        <div className="min-h-screen">
            <ReservationCard />
            <Footer />
        </div>
    )
}