import { adminProducts } from "@/data/admin";

export async function getAdminDashboard() {
  return {
    metrics: [
      { label: "Total Revenue", value: "$24,500", detail: "+12% from last month", icon: "trending_up", tone: "text-primary" },
      { label: "Active Orders", value: "142", detail: "8 requiring attention", icon: "local_shipping", tone: "text-secondary" },
      { label: "Inventory Health", value: "98%", detail: "All core items in stock", icon: "inventory_2", tone: "text-on-surface-variant" },
    ],
    products: adminProducts,
  };
}
