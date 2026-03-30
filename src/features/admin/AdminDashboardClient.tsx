"use client";

import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/features/catalog/product.types";
import type { Order } from "@/features/orders/order.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";
import { calculateAdminMetrics, orderStatusLabels, normalizeOrderStatus } from "@/features/admin/admin-metrics";

export function AdminDashboardClient() {
  const repositories = useBrowserRepositories();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!repositories) return;
    const browserRepositories = repositories;

    let isMounted = true;
    async function loadDashboard() {
      const [nextProducts, nextOrders] = await Promise.all([browserRepositories.catalog.listProducts(), browserRepositories.orders.listOrders()]);
      if (!isMounted) return;
      setProducts(nextProducts);
      setOrders(nextOrders);
      setIsLoading(false);
    }
    loadDashboard().catch(() => setIsLoading(false));
    return () => { isMounted = false; };
  }, [repositories]);

  const metrics = calculateAdminMetrics(products, orders);
  const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 5).slice(0, 5);

  return (
    <>
      <AdminPageHeader title="Panel" description="Resumen operativo de ventas, inventario y actividad reciente." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric icon="trending_up" label="Ingresos" value={formatMoney(metrics.revenue)} />
        <Metric icon="local_shipping" label="Ventas activas" value={String(metrics.activeSales)} />
        <Metric icon="inventory_2" label="Inventario" value={String(metrics.totalInventory)} />
        <Metric icon="group" label="Compradores" value={String(metrics.buyers)} />
        <Metric icon="warning" label="Inventario bajo" value={String(metrics.lowStock)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 font-headline-sm text-headline-sm">Ventas recientes</h2>
          {isLoading ? <p className="text-on-surface-variant">Cargando...</p> : orders.length ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"><div><p className="font-medium">{order.customerName || "Cliente sin nombre"}</p><p className="text-sm text-on-surface-variant">{orderStatusLabels[normalizeOrderStatus(order.status)]}</p></div><span className="text-primary">{formatMoney(order.total)}</span></div>)}
            </div>
          ) : <p className="text-on-surface-variant">Todavía no hay ventas registradas.</p>}
        </AdminCard>
        <AdminCard>
          <h2 className="mb-4 font-headline-sm text-headline-sm">Productos con inventario bajo</h2>
          {lowStockProducts.length ? <div className="space-y-3">{lowStockProducts.map((product) => <div key={product.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"><span>{product.displayName}</span><span className="text-error">{product.stock} unidades</span></div>)}</div> : <p className="text-on-surface-variant">No hay productos críticos.</p>}
        </AdminCard>
      </div>
    </>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <AdminCard><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary"><Icon name={icon} /></div><p className="text-sm text-on-surface-variant">{label}</p><p className="mt-1 text-2xl font-semibold text-on-surface">{value}</p></AdminCard>;
}
