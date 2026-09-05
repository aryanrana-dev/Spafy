import { create } from "zustand";

export const useCheckoutStore = create((set) => ({
    cart: [],
    userInfo: { name: "", email: "", phone: "" },
    isSubmitting: false,
    calculateTotal: () => set((state) => { }),
    validateForm: () => { },
    handleSubmit: () => { }
}))