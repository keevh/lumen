import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type SiteHeaderProps = { variant?: "soft" | "editorial"; active?: string };

const primaryNavItems = [
  { key: "categories", label: "Categorías", href: "/categorias/camisas" },
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
  const activeKey = active ? activeAliases[active] ?? active.toLowerCase() : "";
  if (variant === "editorial") {
    return (
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-unit max-w-container-max-width mx-auto bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-stack-lg">
          <Link className="font-headline-md text-headline-md font-medium tracking-tighter text-on-surface" href="/">LUMEN</Link>
          <nav className="hidden md:flex gap-gutter items-center">
            {primaryNavItems.map((item) => (
              <Link key={item.href} className={`font-label-md text-label-md uppercase tracking-widest transition-colors duration-300 ${activeKey === item.key ? "text-primary font-semibold border-b border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-stack-md text-primary">
          <Link aria-label="Carrito" className="hover:opacity-70 transition-opacity p-unit rounded-full hover:bg-surface-variant" href="/carrito"><Icon name="shopping_bag" /></Link>
          <Link aria-label="Cuenta" className="hover:opacity-70 transition-opacity p-unit rounded-full hover:bg-surface-variant" href="/en-construccion/cuenta"><Icon name="person" /></Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop max-md:px-margin-mobile py-4 bg-surface/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-8">
        <Link className="font-display-lg text-display-lg tracking-tighter text-primary" href="/">LUMEN</Link>
        <nav className="hidden md:flex gap-6 items-center pt-1">
          {primaryNavItems.map((item) => (
            <Link key={item.href} className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md" href={item.href}>{item.label}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4 text-primary">
        <Link aria-label="Buscar" className="hover:opacity-70 transition-opacity p-2" href="/en-construccion/busqueda"><Icon name="search" /></Link>
        <Link aria-label="Cuenta" className="hover:opacity-70 transition-opacity p-2" href="/en-construccion/cuenta"><Icon name="person" /></Link>
        <Link aria-label="Carrito" className="hover:opacity-70 transition-opacity p-2" href="/carrito"><Icon name="shopping_bag" /></Link>
      </div>
    </header>
  );
}
