import { create } from "zustand";
import { useServicesStore } from "./services-store";

export const useCheckoutStore = create((set, get) => ({
    getServices: () => useServicesStore.getState().services,
    userInfo: { name: "Nami", email: "nami@gmail.com", phone: "1234567890" },
    isTermsAgree: false,
    isSubmitting: false,
    getTotal: () => {
        const cart = get().getServices();
        return cart.reduce((acc, curr) => acc + curr.price, 0);
    },
    toggleTerms: () => set((state) => ({ isTermsAgree: !state.isTermsAgree })),
    handleSubmit: () => { }
}))