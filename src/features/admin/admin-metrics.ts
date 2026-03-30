import type { Product } from "@/features/catalog/product.types";
import type { Order, OrderStatus } from "@/features/orders/order.types";

export const manageableOrderStatuses: OrderStatus[] = ["pending", "packing", "in_transit", "delivered", "cancelled"];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  packing: "En empaque",
  in_transit: "En transporte",
  delivered: "Entregado",
  cancelled: "Cancelado",
  draft: "Pendiente",
  submitted: "Pendiente",
  paid: "Pendiente",
};

export function normalizeOrderStatus(status: OrderStatus): OrderStatus {
  if (status === "draft" || status === "submitted" || status === "paid") return "pending";
  return status;
}

export function calculateAdminMetrics(products: Product[], orders: Order[]) {
  const normalizedOrders = orders.map((order) => ({ ...order, status: normalizeOrderStatus(order.status) }));
  const revenue = normalizedOrders.filter((order) => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0);
  const activeSales = normalizedOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const totalInventory = products.reduce((sum, product) => sum + product.stock, 0);
  const buyers = new Set(normalizedOrders.map((order) => order.customerEmail).filter(Boolean)).size;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const productsSold = normalizedOrders.filter((order) => order.status !== "cancelled").flatMap((order) => order.items).reduce((sum, item) => sum + item.quantity, 0);

  return { revenue, activeSales, totalInventory, buyers, lowStock, productsSold };
}
