import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/dress";

/**
 * The shopping bag — the only client state the shop needs.
 *
 * The catalogue is static (src/data/seed-dresses.ts) and rendered on the server; this store
 * only remembers what the visitor put in the bag, across reloads, so they can finish their
 * order on WhatsApp from the drawer wherever they are on the site.
 */

interface ShopState {
  cart: CartItem[];
  cartOpen: boolean;

  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  removeFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,

      addToCart: (item, qty = 1) => {
        const cart = get().cart;
        const existing = cart.find((c) => c.id === item.id && c.size === item.size);
        if (existing) {
          set({
            cart: cart.map((c) =>
              c.id === item.id && c.size === item.size ? { ...c, qty: c.qty + qty } : c
            ),
            cartOpen: true,
          });
        } else {
          set({ cart: [...cart, { ...item, qty }], cartOpen: true });
        }
      },

      setQty: (id, size, qty) =>
        set({
          cart: get()
            .cart.map((c) => (c.id === id && c.size === size ? { ...c, qty } : c))
            .filter((c) => c.qty > 0),
        }),

      removeFromCart: (id, size) =>
        set({ cart: get().cart.filter((c) => !(c.id === id && c.size === size)) }),

      clearCart: () => set({ cart: [] }),

      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: "maison-bag",
      // The drawer flag is transient; only the bag itself is remembered.
      partialize: (s) => ({ cart: s.cart }),
    }
  )
);

// ---- small helpers used across the bag UI ----

export const cartCount = (cart: CartItem[]) => cart.reduce((n, c) => n + c.qty, 0);
export const cartSubtotal = (cart: CartItem[]) => cart.reduce((n, c) => n + c.qty * c.price, 0);
