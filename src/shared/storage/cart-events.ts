import type { Cart } from "@/features/cart/cart.types";

export const CART_UPDATED_EVENT = "lumen:cart-updated";

export function dispatchCartUpdatedEvent(cart: Cart) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Cart>(CART_UPDATED_EVENT, { detail: cart }));
}
