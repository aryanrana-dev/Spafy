import { create } from "zustand";

/**
 * @typedef {Object} Service
 * @property {string|number} id
 * @property {string} name
 * @property {string} img
 */

/**
 * @typedef {Object} ServicesStore
 * @property {Service[]} services
 * @property {boolean} isOpen
 * @property {(service: Service) => void} addService
 * @property {(serviceId: string|number) => void} removeService
 * @property {() => void} reset
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ServicesStore>>} */
export const useServicesStore = create((set) => ({
    services: [],
    isOpen: false,
    addService: (service) => set((state) => ({ services: [...state.services, service], isOpen: true })),
    removeService: (serviceId) => set((state) => ({ services: state.services.filter((service) => service.id !== serviceId) })),
    reset: () => set({ services: [], isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))