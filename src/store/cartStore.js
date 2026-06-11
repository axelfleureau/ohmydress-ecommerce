import { create } from "zustand";
import { persist } from "zustand/middleware";

const itemKey = (item) => `${item.slug || item.name}:${item.size || "default"}`;

export const useCartStore = create(
  persist(
    (set) => ({
      cartId: null,
      cartItems: [],

      ensureCartId: () => {
        let id = null;
        set((state) => {
          if (state.cartId) {
            id = state.cartId;
            return state;
          }

          id =
            globalThis.crypto?.randomUUID?.() ||
            `cart_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

          return { cartId: id };
        });

        return id;
      },

      addToCart: (product, options = {}) => {
        set((state) => {
          const size = options.size || product.sizes?.[0] || "One Size";
          const quantity = Math.max(1, Number(options.quantity) || 1);
          const nextItem = { ...product, size, quantity };
          const key = itemKey(nextItem);
          const existingItem = state.cartItems.find(
            (item) => itemKey(item) === key
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                itemKey(item) === key
                  ? { ...item, quantity: (Number(item.quantity) || 1) + quantity }
                  : item
              ),
            };
          }

          return {
            cartItems: [...state.cartItems, nextItem],
          };
        });
      },

      updateQuantity: (productKey, quantity) => {
        const nextQuantity = Math.max(1, Number(quantity) || 1);
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            itemKey(item) === productKey
              ? { ...item, quantity: nextQuantity }
              : item
          ),
        }));
      },

      removeFromCart: (productKey) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => {
            if (itemKey(item) === productKey) return false;
            return item.name !== productKey;
          }),
        }));
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "ohmydress-cart",
      partialize: (state) => ({ cartId: state.cartId, cartItems: state.cartItems }),
    }
  )
);

export const getCartItemKey = itemKey;

export const useCartCount = () =>
  useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * (item.quantity || 1),
      0
    )
  );
