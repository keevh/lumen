import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main className="flex-grow pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop flex items-center justify-center">
        <section className="max-w-2xl text-center bg-surface/80 backdrop-blur-sm rounded-2xl soft-shadow p-10 md:p-14 border border-outline-variant/10">
          <span className="font-label-caps text-label-caps text-secondary mb-4 block">Error 404</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">No encontramos esta página</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            La ruta que buscas no existe o ya no está disponible. Puedes volver al inicio o explorar nuestra colección principal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="inline-flex items-center justify-center bg-primary text-on-primary font-button text-button px-8 py-4 rounded-full hover:bg-surface-tint transition-colors" href="/">
              Volver al inicio
            </Link>
            <Link className="inline-flex items-center justify-center rounded-full ghost-outline px-8 py-4 font-button text-button transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-variant active:translate-y-0 active:scale-[0.99]" href="/categorias">
              Ver categorías
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
