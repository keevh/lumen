import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type SiteHeaderProps = { variant?: "soft" | "editorial"; active?: string };

export function SiteHeader({ variant = "soft", active }: SiteHeaderProps) {
  if (variant === "editorial") {
    return (
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-unit max-w-container-max-width mx-auto bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-stack-lg">
          <Link className="font-headline-md text-headline-md font-medium tracking-tighter text-on-surface" href="/">LUMEN</Link>
          <nav className="hidden md:flex gap-gutter items-center">
            {["Collections", "Sustainability", "About", "Journal"].map((item) => (
              <Link key={item} className={`font-label-md text-label-md uppercase tracking-widest transition-colors duration-300 ${active === item ? "text-primary font-semibold border-b border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`} href={item === "Collections" ? "/collections/linen" : "#"}>{item}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-stack-md text-primary">
          <Link aria-label="Shopping bag" className="hover:opacity-70 transition-opacity p-unit rounded-full hover:bg-surface-variant" href="/cart"><Icon name="shopping_bag" /></Link>
          <button aria-label="Account" className="hover:opacity-70 transition-opacity p-unit rounded-full hover:bg-surface-variant"><Icon name="person" /></button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop max-md:px-margin-mobile py-4 bg-surface/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-8">
        <Link className="font-display-lg text-display-lg tracking-tighter text-primary" href="/">LUMEN</Link>
        <nav className="hidden md:flex gap-6 items-center pt-1">
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="/collections/linen">Collections</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">Sustainability</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">About</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">Journal</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4 text-primary">
        <button aria-label="Search" className="hover:opacity-70 transition-opacity p-2"><Icon name="search" /></button>
        <button aria-label="User Profile" className="hover:opacity-70 transition-opacity p-2"><Icon name="person" /></button>
        <Link aria-label="Shopping Bag" className="hover:opacity-70 transition-opacity p-2" href="/cart"><Icon name="shopping_bag" /></Link>
      </div>
    </header>
  );
}
