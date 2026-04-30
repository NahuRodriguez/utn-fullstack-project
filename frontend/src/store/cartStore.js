import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    if (get().items.some((i) => i.product._id === product._id)) return;
    set((state) => ({ items: [...state.items, { product, quantity: 1 }] }));
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product._id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  isInCart: (productId) => get().items.some((i) => i.product._id === productId),
}));
