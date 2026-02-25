import { cartItems } from "@/data/cart";

export async function getCart() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 26;

  return { items: cartItems, subtotal, tax, total: subtotal + tax };
}
