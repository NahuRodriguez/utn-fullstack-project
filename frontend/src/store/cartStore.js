import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i._id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      isInCart: (productId) => get().items.some((i) => i._id === productId),
    }),
    { name: "techstore-cart" }
  )
);
