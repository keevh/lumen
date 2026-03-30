"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { calculateAdminMetrics, manageableOrderStatuses, normalizeOrderStatus, orderStatusLabels } from "@/features/admin/admin-metrics";
import type { Product } from "@/features/catalog/product.types";
import type { Order, OrderStatus } from "@/features/orders/order.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

export function AdminSalesClient() {
  const repositories = useBrowserRepositories();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!repositories) return;
    const [nextOrders, nextProducts] = await Promise.all([repositories.orders.listOrders(), repositories.catalog.listProducts()]);
    setOrders(nextOrders);
    setProducts(nextProducts);
  }, [repositories]);

  useEffect(() => { load().catch(() => setMessage("No pudimos cargar las ventas.")); }, [load]);

  async function updateStatus(order: Order, status: OrderStatus) {
    if (!repositories) return;
    await repositories.orders.saveOrder({ ...order, status, updatedAt: new Date().toISOString() });
    setMessage("Estado actualizado.");
    await load();
  }

  const metrics = calculateAdminMetrics(products, orders);

  return (
    <>
      <AdminPageHeader title="Ventas" description="Consulta pedidos creados por checkout y actualiza su estado operativo." />
      {message ? <p className="mb-4 rounded-lg bg-primary-container px-4 py-3 text-on-primary-container" role="status">{message}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Ingresos" value={formatMoney(metrics.revenue)} />
        <Metric label="Ventas activas" value={String(metrics.activeSales)} />
        <Metric label="Compradores" value={String(metrics.buyers)} />
        <Metric label="Inventario" value={String(metrics.totalInventory)} />
        <Metric label="Productos vendidos" value={String(metrics.productsSold)} />
      </div>
      <AdminCard className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm"><thead className="text-on-surface-variant"><tr><th className="py-2">Pedido</th><th>Cliente</th><th>Total</th><th>Productos</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-outline-variant/20"><td className="py-3 font-medium">{order.id}</td><td><p>{order.customerName || "Sin nombre"}</p><p className="text-on-surface-variant">{order.customerEmail || "Sin correo electrónico"}</p></td><td>{formatMoney(order.total)}</td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td><select className="lumen-input rounded px-3 py-2" value={normalizeOrderStatus(order.status)} onChange={(e) => updateStatus(order, e.target.value as OrderStatus)}>{manageableOrderStatuses.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}</select></td><td>{new Date(order.createdAt).toLocaleDateString("es")}</td></tr>)}</tbody></table>
        {!orders.length ? <p className="py-8 text-center text-on-surface-variant">Todavía no hay ventas registradas.</p> : null}
      </AdminCard>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <AdminCard><p className="text-sm text-on-surface-variant">{label}</p><p className="mt-1 text-2xl font-semibold text-on-surface">{value}</p></AdminCard>;
}
