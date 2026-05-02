import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { listFeaturedProducts } from "@/features/catalog/catalog.repository";

export default async function NewArrivalsPage() {
  const featuredProducts = await listFeaturedProducts();

  return (
    <PublicPageTransition className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader active="Novedades" />
      <main className="flex-grow pt-[100px]">
        <ScrollReveal as="section" className="border-b border-outline-variant/20 bg-surface-container-low px-margin-mobile py-16 md:px-margin-desktop md:py-20">
          <div className="mx-auto grid max-w-container-max items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-secondary">Novedades</span>
              <h1 className="font-display-lg text-display-lg-mobile text-on-surface md:text-display-lg">Lo último de LUMEN para renovar tu guardarropa</h1>
              <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">Descubre prendas destacadas para esta temporada con materiales nobles, siluetas serenas y combinaciones pensadas para acompañarte todos los días.</p>
            </div>
            <div className="rounded-3xl bg-surface p-6 soft-shadow">
              <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Selección actual</p>
              <p className="mt-2 font-headline-lg text-headline-lg text-primary">{featuredProducts.length} prendas destacadas</p>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">Explora una curaduría breve con piezas versátiles para empezar por lo nuevo y seguir comprando con contexto.</p>
              <Link className="mt-6 inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity hover:opacity-70" href="/categorias">
                Ver categorías <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <section className="mx-auto w-full max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <ScrollReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Esenciales recién destacados</h2>
              <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">Una selección compacta de productos activos para que la navegación de novedades sea clara, directa y sin depender de anclas en la home.</p>
            </div>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity hover:opacity-70" href="/ofertas">Ver ofertas vigentes</Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
