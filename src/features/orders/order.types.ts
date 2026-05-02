import type { CartItem } from "@/features/cart/cart.types";

export type OrderStatus = "pending" | "packing" | "in_transit" | "delivered" | "cancelled" | "draft" | "submitted" | "paid";

export type Order = {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discountTotal: number;
  discountCode?: string;
  total: number;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: {
    address: string;
    apartment?: string;
    city: string;
    zip: string;
    phone: string;
  };
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
};

export interface OrdersRepository {
  listOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  saveOrder(order: Order): Promise<Order>;
}
