"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export const adminSessionKey = "lumens-admin-session";

const links = [
  { href: "/admin", label: "Panel", icon: "dashboard" },
  { href: "/admin/productos", label: "Productos", icon: "inventory_2" },
  { href: "/admin/sales", label: "Ventas", icon: "receipt_long" },
  { href: "/admin/config", label: "Configuración", icon: "settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(pathname === "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }
    const hasSession = sessionStorage.getItem(adminSessionKey) === "active";
    setIsAuthenticated(hasSession);
    if (!hasSession) router.replace("/admin/login");
  }, [pathname, router]);

  function logout() {
    sessionStorage.removeItem(adminSessionKey);
    router.replace("/admin/login");
  }

  return (
    <div className="theme-admin min-h-screen bg-background text-on-background font-body-md lg:flex">
      <aside className="border-b border-outline-variant/30 bg-surface-container-low lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="px-5 py-5 lg:px-8 lg:py-8">
          <Link className="font-headline-sm text-headline-sm text-primary" href="/">LUMEN</Link>
          <p className="mt-1 text-sm text-on-surface-variant">Panel de administración</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={`flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                href={link.href}
              >
                <Icon name={link.icon} className="text-xl" />
                <span className="font-label-md text-label-md">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        {pathname !== "/admin/login" ? <div className="px-4 pb-6"><button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-variant hover:text-on-surface" type="button" onClick={logout}><Icon name="logout" className="text-xl" /><span className="font-label-md text-label-md">Cerrar sesión</span></button></div> : null}
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 lg:px-12">{isAuthenticated ? children : null}</main>
    </div>
  );
}
