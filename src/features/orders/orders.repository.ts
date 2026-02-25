import { getCart } from "@/features/cart/cart.repository";

export async function getCheckoutSummary() {
  return getCart();
}
