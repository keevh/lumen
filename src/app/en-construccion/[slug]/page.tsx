import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main className="flex-grow pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop flex items-center justify-center">
        <section className="max-w-2xl text-center bg-surface/80 backdrop-blur-sm rounded-2xl soft-shadow p-10 md:p-14 border border-outline-variant/10">
          <Icon name="construction" className="text-primary text-5xl mb-6 block" />
          <span className="font-label-caps text-label-caps text-secondary mb-4 block">Sección en construcción</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">{sectionName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            Estamos preparando esta sección para que mantenga la experiencia serena y cuidada de LUMEN. Mientras tanto, puedes explorar nuestras categorías.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="inline-flex items-center justify-center bg-primary text-on-primary font-button text-button px-8 py-4 rounded-full hover:bg-surface-tint transition-colors" href="/categorias/camisas">
              Ver categorías
            </Link>
            <Link className="inline-flex items-center justify-center ghost-outline font-button text-button px-8 py-4 rounded-full" href="/">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
