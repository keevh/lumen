import Link from "next/link";

const editorialLinks = [
  { label: "Abastecimiento ético", href: "/en-construccion/abastecimiento-etico" },
  { label: "Envíos", href: "/en-construccion/envios" },
  { label: "Devoluciones", href: "/en-construccion/devoluciones" },
  { label: "Contacto", href: "/en-construccion/contacto" },
];

const footerLinks = [
  { label: "Términos", href: "/en-construccion/terminos" },
  { label: "Privacidad", href: "/en-construccion/privacidad" },
  { label: "Envíos", href: "/en-construccion/envios" },
  { label: "Mayoristas", href: "/en-construccion/mayoristas" },
];

export function SiteFooter({ variant = "soft" }: { variant?: "soft" | "editorial" | "checkout" }) {
  if (variant === "editorial") {
    return <footer className="w-full flex flex-col items-center py-stack-lg px-margin-desktop gap-stack-md bg-surface-container-low"><div className="font-headline-sm text-headline-sm font-medium text-on-surface">LUMEN</div><nav className="flex flex-wrap justify-center gap-gutter text-body-md text-on-secondary-fixed-variant">{editorialLinks.map((link) => <Link key={link.href} className="hover:text-primary transition-colors" href={link.href}>{link.label}</Link>)}</nav><p className="font-body-md text-body-md text-secondary mt-stack-sm text-center">© 2024 LUMEN. Creado con intención.</p></footer>;
  }
  return <footer className="w-full py-section-gap px-margin-desktop max-md:px-margin-mobile flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container mt-auto"><div className="font-headline-sm text-headline-sm text-primary">LUMEN</div><nav className="flex flex-wrap justify-center gap-6 md:gap-8">{footerLinks.map((link) => <Link key={link.href} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps opacity-80" href={link.href}>{link.label}</Link>)}</nav><div className="font-label-caps text-label-caps text-secondary opacity-80">© 2024 LUMEN BIENES ÉTICOS</div></footer>;
}
