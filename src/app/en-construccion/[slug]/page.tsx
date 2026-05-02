import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";

const sectionNames: Record<string, string> = {
  "abastecimiento-etico": "Abastecimiento ético",
  busqueda: "Búsqueda",
  contacto: "Contacto",
  cuenta: "Cuenta",
  devoluciones: "Devoluciones",
  diario: "Diario",
  envios: "Envíos",
  mayoristas: "Mayoristas",
  nosotros: "Nosotros",
  privacidad: "Privacidad",
  sostenibilidad: "Sostenibilidad",
  terminos: "Términos",
};

function getSectionName(slug: string) {
  return sectionNames[slug] ?? slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export default async function UnderConstructionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sectionName = getSectionName(decodeURIComponent(slug));

  return (
    <PublicPageTransition className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main className="flex-grow pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop flex items-center justify-center">
        <ScrollReveal as="section" className="max-w-2xl rounded-2xl border border-outline-variant/10 bg-surface/80 p-10 text-center backdrop-blur-sm soft-shadow md:p-14">
          <Icon name="construction" className="text-primary text-5xl mb-6 block" />
          <span className="font-label-caps text-label-caps text-secondary mb-4 block">Sección en construcción</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">{sectionName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            Estamos preparando esta sección para que mantenga la experiencia serena y cuidada de LUMEN. Mientras tanto, puedes explorar nuestras categorías.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/categorias">
              Ver categorías
            </Link>
            <Link className="inline-flex items-center justify-center ghost-outline font-button text-button px-8 py-4 rounded-full" href="/">
              Volver al inicio
            </Link>
          </div>
        </ScrollReveal>
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
