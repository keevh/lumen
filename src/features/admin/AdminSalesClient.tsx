"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const shouldReduceMotion = useReducedMotion();

  const load = useCallback(async () => {
    if (!repositories) return;
    const [nextOrders, nextProducts] = await Promise.all([repositories.orders.listOrders(), repositories.catalog.listProducts()]);
    setOrders(nextOrders);
    setProducts(nextProducts);
  }, [repositories]);

  useEffect(() => { load().catch(() => setMessage("No pudimos cargar las ventas.")); }, [load]);

  useEffect(() => {
    const activeOrders = orders.filter((order) => !isArchivedOrder(order));
    const fallbackOrder = activeOrders[0] ?? orders[0] ?? null;

    if (!fallbackOrder) {
      setSelectedOrderId("");
      return;
    }

    const hasSelectedOrder = orders.some((order) => order.id === selectedOrderId);
    if (!hasSelectedOrder) setSelectedOrderId(fallbackOrder.id);
  }, [orders, selectedOrderId]);

  async function updateStatus(order: Order, status: OrderStatus) {
    if (!repositories) return;
    await repositories.orders.saveOrder({ ...order, status, updatedAt: new Date().toISOString() });
    setMessage("Estado actualizado.");
    await load();
  }

  const metrics = calculateAdminMetrics(products, orders);
  const activeOrders = orders.filter((order) => !isArchivedOrder(order));
  const archivedOrders = orders.filter((order) => isArchivedOrder(order));
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <>
      <AdminPageHeader title="Ventas" description="Consulta pedidos creados por checkout, revisa sus artículos y actualiza su estado operativo." />
      {message ? <p className="mb-4 rounded-lg bg-primary-container px-4 py-3 text-on-primary-container" role="status">{message}</p> : null}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Ingresos" value={formatMoney(metrics.revenue)} />
        <Metric label="Ventas activas" value={String(metrics.activeSales)} />
        <Metric label="Compradores" value={String(metrics.buyers)} />
        <Metric label="Inventario" value={String(metrics.totalInventory)} />
        <Metric label="Productos vendidos" value={String(metrics.productsSold)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
        <div className="space-y-6">
          <AdminCard className="overflow-x-auto">
            <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-headline-sm text-headline-sm text-on-surface">Pedidos activos</h2><span className="rounded-full bg-surface-container px-3 py-1 text-xs text-on-surface-variant">{activeOrders.length} pedidos</span></div>
            <table className="w-full min-w-[780px] text-left text-sm"><thead className="text-on-surface-variant"><tr><th className="py-2">Pedido</th><th>Cliente</th><th>Total</th><th>Unidades</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{activeOrders.map((order) => <tr key={order.id} className={`cursor-pointer border-t border-outline-variant/20 transition-colors duration-200 hover:bg-surface-container-low ${selectedOrderId === order.id ? "bg-primary-fixed/30" : ""}`} onClick={() => setSelectedOrderId(order.id)}><td className="py-3 font-medium">{order.id}</td><td><p>{order.customerName || "Sin nombre"}</p><p className="text-on-surface-variant">{order.customerEmail || "Sin correo electrónico"}</p></td><td>{formatMoney(order.total)}</td><td>{getOrderUnits(order)}</td><td><select className="lumen-input rounded px-3 py-2" value={normalizeOrderStatus(order.status)} onClick={(event) => event.stopPropagation()} onChange={(e) => updateStatus(order, e.target.value as OrderStatus)}>{manageableOrderStatuses.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}</select></td><td>{new Date(order.createdAt).toLocaleDateString("es")}</td></tr>)}</tbody></table>
            {!activeOrders.length ? <p className="py-8 text-center text-on-surface-variant">No hay pedidos activos en este momento.</p> : null}
          </AdminCard>

          <motion.details className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 soft-shadow" initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            <summary className="cursor-pointer list-none font-headline-sm text-headline-sm text-on-surface"><div className="flex items-center justify-between gap-3"><span>Historial</span><span className="rounded-full bg-surface-container px-3 py-1 text-xs text-on-surface-variant">{archivedOrders.length} pedidos</span></div></summary>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm"><thead className="text-on-surface-variant"><tr><th className="py-2">Pedido</th><th>Cliente</th><th>Total</th><th>Unidades</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{archivedOrders.map((order) => <tr key={order.id} className={`cursor-pointer border-t border-outline-variant/20 transition-colors duration-200 hover:bg-surface-container-low ${selectedOrderId === order.id ? "bg-primary-fixed/30" : ""}`} onClick={() => setSelectedOrderId(order.id)}><td className="py-3 font-medium">{order.id}</td><td><p>{order.customerName || "Sin nombre"}</p><p className="text-on-surface-variant">{order.customerEmail || "Sin correo electrónico"}</p></td><td>{formatMoney(order.total)}</td><td>{getOrderUnits(order)}</td><td><span className="inline-flex rounded-full bg-surface-container px-3 py-1 text-xs text-on-surface-variant">{orderStatusLabels[normalizeOrderStatus(order.status)]}</span></td><td>{new Date(order.createdAt).toLocaleDateString("es")}</td></tr>)}</tbody></table>
              {!archivedOrders.length ? <p className="py-8 text-center text-on-surface-variant">No hay pedidos archivados todavía.</p> : null}
            </div>
          </motion.details>
        </div>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-headline-sm text-headline-sm text-on-surface">Detalle del pedido</h2>{selectedOrder ? <span className="rounded-full bg-surface-container px-3 py-1 text-xs text-on-surface-variant">{selectedOrder.id}</span> : null}</div>
          {selectedOrder ? <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2"><InfoBlock label="Cliente" value={selectedOrder.customerName || "Sin nombre"} secondary={selectedOrder.customerEmail || "Sin correo electrónico"} /><InfoBlock label="Estado" value={orderStatusLabels[normalizeOrderStatus(selectedOrder.status)]} /><InfoBlock label="Total" value={formatMoney(selectedOrder.total)} /><InfoBlock label="Unidades" value={String(getOrderUnits(selectedOrder))} /></div><div><h3 className="mb-3 font-label-md text-label-md uppercase tracking-widest text-on-surface">Artículos comprados</h3><div className="space-y-3">{selectedOrder.items.map((item) => <div key={item.id} className="flex items-start gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3"><img alt={item.name} className="h-16 w-16 rounded-lg object-cover bg-surface-container" src={item.image} /><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-medium text-on-surface">{item.name}</p><p className="text-sm text-on-surface-variant">{item.variant}</p></div><p className="font-medium text-on-surface">{formatMoney(item.unitPrice * item.quantity)}</p></div><p className="mt-2 text-sm text-on-surface-variant">{item.quantity} unidad{item.quantity === 1 ? "" : "es"} · {formatMoney(item.unitPrice)} por unidad</p></div></div>)}</div></div></div> : <p className="text-on-surface-variant">Selecciona un pedido para revisar sus artículos.</p>}
        </AdminCard>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <AdminCard><p className="text-sm text-on-surface-variant">{label}</p><p className="mt-1 text-2xl font-semibold text-on-surface">{value}</p></AdminCard>;
}

function InfoBlock({ label, value, secondary }: { label: string; value: string; secondary?: string }) {
  return <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"><p className="text-xs uppercase tracking-widest text-on-surface-variant">{label}</p><p className="mt-2 font-medium text-on-surface">{value}</p>{secondary ? <p className="mt-1 text-sm text-on-surface-variant">{secondary}</p> : null}</div>;
}

function getOrderUnits(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function isArchivedOrder(order: Order) {
  const status = normalizeOrderStatus(order.status);
  return status === "cancelled" || status === "delivered";
}
