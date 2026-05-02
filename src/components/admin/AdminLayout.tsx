"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RouteTransition } from "@/components/motion/primitives";
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
  const isLoginPage = pathname === "/admin/login";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(false);
      return;
    }

    const hasSession = sessionStorage.getItem(adminSessionKey) === "active";
    setIsAuthenticated(hasSession);
    if (!hasSession) router.replace("/admin/login");
  }, [isLoginPage, router]);

  function logout() {
    sessionStorage.removeItem(adminSessionKey);
    setMobileMenuOpen(false);
    router.replace("/admin/login");
  }

  return (
    <div className={`theme-admin min-h-screen bg-background text-on-background font-body-md ${isLoginPage ? "" : "lg:flex"}`}>
      {!isLoginPage && isAuthenticated ? <aside className="border-b border-outline-variant/30 bg-surface-container-low lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-8 lg:py-8">
          <Link className="font-headline-sm text-headline-sm text-primary" href="/">LUMEN</Link>
          <div className="flex items-center gap-2 lg:hidden">
            <button className="inline-flex items-center justify-center rounded-lg p-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-variant hover:text-on-surface" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"} onClick={() => setMobileMenuOpen((current) => !current)}>
              <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
            </button>
            <button className="inline-flex items-center justify-center rounded-lg p-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-variant hover:text-on-surface" type="button" aria-label="Cerrar sesión" onClick={logout}>
              <Icon name="logout" className="text-xl" />
            </button>
          </div>
        </div>
        <div className="px-5 pb-3 lg:px-8"><p className="text-sm text-on-surface-variant">Panel de administración</p></div>

        <div className="hidden lg:block">
          <nav className="flex flex-col gap-2 px-4 pb-8">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <motion.div key={link.href} whileHover={shouldReduceMotion ? undefined : { x: 4 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                  <Link
                    className={`flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                    href={link.href}
                  >
                    <Icon name={link.icon} className="text-xl" />
                    <span className="font-label-md text-label-md">{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="px-4 pb-6"><button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-on-surface-variant transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-variant hover:text-on-surface active:translate-y-0 active:scale-[0.99]" type="button" onClick={logout}><Icon name="logout" className="text-xl" /><span className="font-label-md text-label-md">Cerrar sesión</span></button></div>
        </div>

        <div className="lg:hidden">
          <AnimatePresence initial={false}>
            {mobileMenuOpen ? <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col gap-2 px-4 pb-4">
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <motion.div key={link.href} whileHover={shouldReduceMotion ? undefined : { x: 4 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                      <Link
                        className={`flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                        href={link.href}
                      >
                        <Icon name={link.icon} className="text-xl" />
                        <span className="font-label-md text-label-md">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div> : null}
          </AnimatePresence>
        </div>
      </aside> : null}
      <main className={`min-w-0 flex-1 px-5 py-8 md:px-10 lg:px-12 ${isLoginPage ? "min-h-screen" : ""}`}>
        {isLoginPage || isAuthenticated ? <RouteTransition tone="admin">{children}</RouteTransition> : null}
      </main>
    </div>
  );
}
