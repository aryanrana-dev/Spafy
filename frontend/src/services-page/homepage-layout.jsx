import React, { useState, useEffect } from 'react';
import Hero from './hero';
import BottomNav from './bottom-nav';
import Header from './header';
import ServiceCard from './service-card';
import FloatBtn from './float-btn';
import CartDrawer from './services-cart';
import "./homepage-layout.css";
import { useServicesStore } from '../stores/services-store';
import { useServices } from '../queries/services-queries';

export default function HomepageLayout() {

    const { data, isLoading, isError, error } = useServices();

    const services = useServicesStore((state) => state.services);
    const isOpen = useServicesStore((state) => state.isOpen);
    const addService = useServicesStore((state) => state.addService);
    const removeService = useServicesStore((state) => state.removeService);
    const reset = useServicesStore((state) => state.reset);
    const toggle = useServicesStore((state) => state.toggle);
    return (<>
        <div className="min-h-screen pb-32 animate-in fade-in duration-700">
            <Header services={services} showCart={toggle} />

            <main className="pt-20">
                <Hero />
                <CartDrawer isOpen={isOpen} onClose={toggle} subtotal="$0" services={services} />
                <section className="container mx-auto max-w-[1200px] px-6 md:px-16 py-12">
                    <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
                        {isLoading && <p className="text-center text-[#4e4540]">Loading services...</p>}
                        {isError && <p className="text-center text-red-500">Failed to load services</p>}
                        {data?.length > 0 ? (
                            data.map((item) => (
                                <ServiceCard
                                    key={item._id || item.id}
                                    category={item.category || "SERVICE"}
                                    title={item.name}
                                    description={item.description || `${item.durationMinutes ? item.durationMinutes + " mins" : "Duration vary"} • ₹${item.price ?? 0}`}
                                    duration={item.durationMinutes}
                                    price={item.price}
                                    addService={addService}
                                    image={item.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80"}
                                />
                            ))
                        ) : (
                            !isLoading && <p className="text-center text-[#4e4540]">No services available.</p>
                        )}
                    </div>
                </section>
            </main>

            <BottomNav />
            <FloatBtn />
        </div>
    </>)
}