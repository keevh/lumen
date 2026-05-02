import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { heroImage } from "@/data/catalog";
import { getProductPricing } from "@/features/catalog/pricing";
import { listFeaturedProducts, listOfferProducts } from "@/features/catalog/catalog.repository";
import { formatMoney } from "@/lib/format";

export default async function HomePage() {
  const featured = await listFeaturedProducts();
  const offerProducts = await listOfferProducts();
  const offerPreview = offerProducts.slice(0, 2);
  const maxSavings = offerProducts.reduce((max, product) => Math.max(max, getProductPricing(product).discountAmount), 0);

  return (
    <PublicPageTransition className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />

      <main className="flex-grow pt-[100px]">
        <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-surface-container-low px-margin-desktop h-[819px] max-md:px-margin-mobile">
          <div className="absolute inset-0 z-0">
            <img alt="Colección de verano Lumen" className="h-full w-full object-cover object-top opacity-90" src={heroImage} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          <ScrollReveal className="relative z-10 max-w-2xl rounded-xl bg-surface/80 p-12 text-center backdrop-blur-sm soft-shadow">
            <span className="mb-4 block font-label-caps text-label-caps text-secondary">Novedades</span>
            <h1 className="mb-6 font-display-lg text-display-lg text-on-surface max-md:font-display-lg-mobile max-md:text-display-lg-mobile">Lienzo sereno</h1>
            <p className="mx-auto mb-8 max-w-lg font-body-lg text-body-lg text-on-surface-variant">Acompaña la transición de temporadas con nuestra última colección. Lino y algodón orgánico diseñados con intención para una vida consciente.</p>
            <Link className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/categorias">Explorar categorías</Link>
          </ScrollReveal>
        </section>

        <ScrollReveal as="section" className="mx-auto max-w-container-max px-margin-desktop py-section-gap max-md:px-margin-mobile">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-headline-md text-headline-md text-on-surface">Esenciales curados</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Piezas diseñadas para durar, trascender tendencias y convertirse en básicos de tu ritmo diario.</p>
            </div>
            <Link className="hidden items-center gap-2 font-button text-button text-primary transition-all duration-200 hover:opacity-70 md:flex" href="/novedades">
              Ver novedades <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 70}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <section className="bg-surface-container-low px-margin-desktop py-section-gap max-md:px-margin-mobile">
          <div className="mx-auto max-w-container-max">
            {offerProducts.length > 0 ? (
              <div className="grid gap-gutter lg:grid-cols-[0.95fr_1.05fr]">
                <ScrollReveal className="rounded-3xl bg-surface p-8 soft-shadow md:p-10">
                  <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-secondary">Ofertas vigentes</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Aprovechá una selección con descuentos visibles y salida directa a compra.</h2>
                  <p className="mt-4 max-w-xl font-body-md text-body-md text-on-surface-variant">Entrá a una vidriera comercial conectada con el catálogo real. Encontrá prendas con precio actual reducido, stock activo y acceso inmediato a la página completa de ofertas.</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-surface-container-low px-5 py-4">
                      <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Prendas en oferta</p>
                      <p className="mt-2 font-headline-md text-headline-md text-primary">{offerProducts.length}</p>
                    </div>
                    <div className="rounded-2xl bg-primary-container px-5 py-4">
                      <p className="font-label-md text-label-md uppercase tracking-widest text-on-primary-container/80">Ahorro destacado</p>
                      <p className="mt-2 font-headline-md text-headline-md text-on-primary-container">Hasta {formatMoney(maxSavings)}</p>
                    </div>
                  </div>
                  <Link className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/ofertas">Ver todas las ofertas</Link>
                </ScrollReveal>

                <div className="grid gap-gutter md:grid-cols-2">
                  {offerPreview.map((product, index) => (
                    <ScrollReveal key={product.id} delay={index * 80}>
                      <ProductCard product={product} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ) : (
              <ScrollReveal className="rounded-3xl bg-surface px-8 py-12 text-center soft-shadow md:px-12">
                <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-secondary">Ofertas</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Por ahora no hay ofertas</h2>
                <p className="mx-auto mt-3 max-w-2xl font-body-md text-body-md text-on-surface-variant">Estamos preparando nuevas oportunidades para vos. Mientras tanto, podés explorar la colección completa y volver pronto para ver las próximas ofertas.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/categorias">Explorar categorías</Link>
                  <Link className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity hover:opacity-70" href="/ofertas">
                    Ir a ofertas <Icon name="arrow_forward" className="text-sm" />
                  </Link>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </PublicPageTransition>
  );
}
