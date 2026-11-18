import { create } from "zustand";

/**
 * Zustand store for Bookings UI state
 * Handles filters, modal dialogs, and selected booking inspection.
 */
export const useBookingsStore = create((set) => ({
  // Filter: 'all' | 'upcoming' | 'completed'
  filter: "all",
  setFilter: (filter) => set({ filter }),

  // Modal Dialogs: null | 'qr' | 'receipt' | 'reschedule' | 'concierge'
  activeModal: null,
  selectedBooking: null,

  openModal: (modalType, booking = null) =>
    set({
      activeModal: modalType,
      selectedBooking: booking,
    }),

  closeModal: () =>
    set({
      activeModal: null,
      selectedBooking: null,
    }),

  // Mobile menu / drawer in header
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Reset store
  reset: () =>
    set({
      filter: "all",
      activeModal: null,
      selectedBooking: null,
      isMobileMenuOpen: false,
    }),
}));

