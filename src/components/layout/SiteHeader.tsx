"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type SiteHeaderProps = { variant?: "soft" | "editorial"; active?: string };

const primaryNavItems = [
  { key: "home", label: "Inicio", href: "/" },
  { key: "categories", label: "Categorías", href: "/categorias" },
  { key: "new", label: "Novedades", href: "/novedades" },
  { key: "offers", label: "Ofertas", href: "/ofertas" },
];

const activeAliases: Record<string, string> = {
  Home: "home",
  Categories: "categories",
  Categorías: "categories",
  Novedades: "new",
  Offers: "offers",
  Ofertas: "offers",
  Cart: "cart",
  Carrito: "cart",
};

const headerShellClass = "border-b border-[#c4c8c1]/40 bg-[#faf9f6]/90 shadow-sm backdrop-blur-md";
const navIdleClass = "text-[#434843] hover:text-[#556257]";
const navActiveClass = "text-[#556257]";

export function SiteHeader({ active }: SiteHeaderProps) {
  const pathname = usePathname();
  const activeKey = active ? activeAliases[active] ?? active.toLowerCase() : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routeActiveKey = pathname === "/"
    ? "home"
    : pathname.startsWith("/categorias") || pathname.startsWith("/productos")
      ? "categories"
      : pathname.startsWith("/novedades")
        ? "new"
      : pathname.startsWith("/ofertas")
        ? "offers"
      : pathname.startsWith("/carrito")
        ? "cart"
        : "";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const resolvedActiveKey = activeKey || routeActiveKey;
  const navLinkClass = (itemKey: string) => resolvedActiveKey === itemKey ? navActiveClass : navIdleClass;
  const isCartActive = resolvedActiveKey === "cart";
  const mobilePanel = (
    <div className={`${mobileMenuOpen ? "block" : "hidden"} absolute left-0 top-full w-full border-b border-[#c4c8c1]/40 bg-[#faf9f6]/95 px-margin-mobile py-4 shadow-sm backdrop-blur-md md:hidden`}>
        <nav className="flex flex-col gap-2">
          {primaryNavItems.map((item) => (
            <Link key={item.href} className={`rounded-xl px-4 py-3 font-label-md text-label-md uppercase tracking-widest transition-all duration-200 hover:bg-[#efeeeb] ${navLinkClass(item.key)}`} href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
        ))}
      </nav>
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 z-50 w-full ${headerShellClass}`}>
      <div className="mx-auto grid w-full max-w-container-max items-center gap-4 px-margin-mobile py-4 md:grid-cols-[1fr_auto_1fr] md:px-margin-desktop">
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <Link className="font-display-lg text-display-lg tracking-tighter text-[#556257]" href="/">LUMEN</Link>
          <div className="flex items-center gap-2 md:hidden">
            <Link aria-label="Ir al carrito" className={`inline-flex rounded-full p-2 transition-colors duration-200 hover:bg-[#efeeeb] ${isCartActive ? navActiveClass : navIdleClass}`} href="/carrito">
              <Icon name="shopping_bag" />
            </Link>
            <button className="inline-flex rounded-full p-2 text-[#434843] transition-colors duration-200 hover:bg-[#efeeeb] hover:text-[#556257]" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"} onClick={() => setMobileMenuOpen((current) => !current)}><Icon name={mobileMenuOpen ? "close" : "menu"} /></button>
          </div>
        </div>
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {primaryNavItems.map((item) => (
            <Link key={item.href} className={`relative font-label-md text-label-md uppercase tracking-[0.18em] transition-colors duration-300 ${navLinkClass(item.key)}`} href={item.href}><span>{item.label}</span>{resolvedActiveKey === item.key ? <span className="absolute inset-x-0 -bottom-2 mx-auto h-px w-8 bg-[#556257]" /> : null}</Link>
          ))}
        </nav>
        <div className="hidden items-center justify-end md:flex">
          <Link aria-label="Ir al carrito" className={`inline-flex rounded-full border border-[#c4c8c1]/50 p-3 transition-colors duration-200 hover:border-[#556257]/40 hover:bg-[#efeeeb] ${isCartActive ? navActiveClass : navIdleClass}`} href="/carrito">
            <Icon name="shopping_bag" />
          </Link>
        </div>
      </div>
      {mobilePanel}
    </header>
  );
}
