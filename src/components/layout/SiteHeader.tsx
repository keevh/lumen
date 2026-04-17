"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type SiteHeaderProps = { variant?: "soft" | "editorial"; active?: string };

const primaryNavItems = [
  { key: "categories", label: "Categorías", href: "/categorias" },
  { key: "sustainability", label: "Sostenibilidad", href: "/en-construccion/sostenibilidad" },
  { key: "about", label: "Nosotros", href: "/en-construccion/nosotros" },
  { key: "journal", label: "Diario", href: "/en-construccion/diario" },
];

const activeAliases: Record<string, string> = {
  Collections: "collections",
  Colecciones: "collections",
  Categories: "categories",
  Categorías: "categories",
};

export function SiteHeader({ variant = "soft", active }: SiteHeaderProps) {
  const pathname = usePathname();
  const activeKey = active ? activeAliases[active] ?? active.toLowerCase() : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (itemKey: string) => activeKey === itemKey ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary";
  const mobilePanel = (
    <div className={`${mobileMenuOpen ? "block" : "hidden"} absolute left-0 top-full w-full border-b border-outline-variant/20 bg-surface/95 px-margin-mobile py-4 shadow-sm backdrop-blur-md md:hidden`}>
      <nav className="flex flex-col gap-2">
        {primaryNavItems.map((item) => (
          <Link key={item.href} className={`rounded-xl px-4 py-3 font-label-md text-label-md uppercase tracking-widest transition-all duration-200 hover:bg-surface-variant ${navLinkClass(item.key)}`} href={item.href}>{item.label}</Link>
        ))}
      </nav>
      <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/20 pt-4 text-primary">
        {variant === "editorial" ? <><Link aria-label="Carrito" className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-variant" href="/carrito"><Icon name="shopping_bag" /><span>Carrito</span></Link><Link aria-label="Cuenta" className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-variant" href="/en-construccion/cuenta"><Icon name="person" /><span>Cuenta</span></Link></> : <><Link aria-label="Buscar" className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-variant" href="/en-construccion/busqueda"><Icon name="search" /><span>Buscar</span></Link><Link aria-label="Cuenta" className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-variant" href="/en-construccion/cuenta"><Icon name="person" /><span>Cuenta</span></Link><Link aria-label="Carrito" className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-variant" href="/carrito"><Icon name="shopping_bag" /><span>Carrito</span></Link></>}
      </div>
    </div>
  );

  if (variant === "editorial") {
    return (
      <header className="fixed top-0 left-0 z-50 w-full bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-container-max-width items-center justify-between gap-4 px-margin-mobile py-3 md:px-margin-desktop">
        <div className="flex items-center gap-stack-lg">
          <Link className="font-headline-md text-headline-md font-medium tracking-tighter text-on-surface" href="/">LUMEN</Link>
          <nav className="hidden md:flex gap-gutter items-center">
            {primaryNavItems.map((item) => (
              <Link key={item.href} className={`font-label-md text-label-md uppercase tracking-widest transition-colors duration-300 ${activeKey === item.key ? "text-primary font-semibold border-b border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-stack-md text-primary">
          <div className="hidden items-center gap-stack-md md:flex">
            <Link aria-label="Carrito" className="rounded-full p-unit transition-all duration-200 hover:bg-surface-variant hover:opacity-70 active:scale-[0.96]" href="/carrito"><Icon name="shopping_bag" /></Link>
            <Link aria-label="Cuenta" className="rounded-full p-unit transition-all duration-200 hover:bg-surface-variant hover:opacity-70 active:scale-[0.96]" href="/en-construccion/cuenta"><Icon name="person" /></Link>
          </div>
          <button className="inline-flex rounded-full p-2 transition-colors duration-200 hover:bg-surface-variant md:hidden" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"} onClick={() => setMobileMenuOpen((current) => !current)}><Icon name={mobileMenuOpen ? "close" : "menu"} /></button>
        </div>
        </div>
        {mobilePanel}
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-surface/80 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-margin-desktop py-4 max-md:px-margin-mobile">
      <div className="flex items-center gap-8">
        <Link className="font-display-lg text-display-lg tracking-tighter text-primary" href="/">LUMEN</Link>
        <nav className="hidden md:flex gap-6 items-center pt-1">
          {primaryNavItems.map((item) => (
            <Link key={item.href} className={`font-body-md text-body-md transition-colors duration-300 ${navLinkClass(item.key)}`} href={item.href}>{item.label}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4 text-primary">
        <div className="hidden items-center gap-4 md:flex">
          <Link aria-label="Buscar" className="rounded-full p-2 transition-all duration-200 hover:bg-surface-variant hover:opacity-70 active:scale-[0.96]" href="/en-construccion/busqueda"><Icon name="search" /></Link>
          <Link aria-label="Cuenta" className="rounded-full p-2 transition-all duration-200 hover:bg-surface-variant hover:opacity-70 active:scale-[0.96]" href="/en-construccion/cuenta"><Icon name="person" /></Link>
          <Link aria-label="Carrito" className="rounded-full p-2 transition-all duration-200 hover:bg-surface-variant hover:opacity-70 active:scale-[0.96]" href="/carrito"><Icon name="shopping_bag" /></Link>
        </div>
        <button className="inline-flex rounded-full p-2 transition-colors duration-200 hover:bg-surface-variant md:hidden" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"} onClick={() => setMobileMenuOpen((current) => !current)}><Icon name={mobileMenuOpen ? "close" : "menu"} /></button>
      </div>
      </div>
      {mobilePanel}
    </header>
  );
}
