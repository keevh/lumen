import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Icon } from "@/components/ui/Icon";
import { heroImage, valueImage } from "@/data/catalog";
import { listFeaturedProducts } from "@/features/catalog/catalog.repository";

export default async function HomePage() {
  const featured = await listFeaturedProducts();
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <main className="flex-grow pt-[88px]">
        <section className="relative w-full h-[819px] min-h-[600px] flex items-center justify-center px-margin-desktop max-md:px-margin-mobile bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 z-0"><img alt="Colección de verano Lumen" className="w-full h-full object-cover object-top opacity-90" src={heroImage} /><div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" /></div>
          <div className="relative z-10 text-center max-w-2xl bg-surface/80 backdrop-blur-sm p-12 rounded-xl soft-shadow">
            <span className="font-label-caps text-label-caps text-secondary mb-4 block">Novedades</span>
            <h1 className="font-display-lg max-md:font-display-lg-mobile text-display-lg max-md:text-display-lg-mobile text-on-surface mb-6">Lienzo sereno</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">Acompaña la transición de temporadas con nuestra última colección. Lino y algodón orgánico diseñados con intención para una vida consciente.</p>
            <Link className="inline-flex items-center justify-center bg-primary text-on-primary font-button text-button px-8 py-4 rounded-full hover:bg-surface-tint transition-colors" href="/categorias/camisas">Explorar categorías</Link>
          </div>
        </section>
        <section className="py-section-gap px-margin-desktop max-md:px-margin-mobile max-w-container-max mx-auto" id="collections">
          <div className="flex justify-between items-end mb-12"><div><h2 className="font-headline-md text-headline-md text-on-surface mb-2">Esenciales curados</h2><p className="font-body-md text-body-md text-on-surface-variant">Piezas diseñadas para durar, trascender tendencias y convertirse en básicos de tu ritmo diario.</p></div><Link className="hidden md:flex items-center gap-2 font-button text-button text-primary hover:opacity-70 transition-opacity" href="/categorias/camisas">Ver todo <Icon name="arrow_forward" className="text-sm" /></Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>
        <section className="py-section-gap px-margin-desktop max-md:px-margin-mobile bg-surface-container-low"><div className="max-w-container-max mx-auto"><div className="grid grid-cols-1 md:grid-cols-3 gap-gutter h-auto md:h-[600px]"><div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-10 flex flex-col justify-end relative overflow-hidden soft-shadow"><img alt="Producción ética" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" src={valueImage} /><div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent" /><div className="relative z-10 max-w-md"><Icon name="eco" className="text-primary mb-4 block text-4xl" /><h2 className="font-headline-md text-headline-md text-on-surface mb-3">Transparencia radical</h2><p className="font-body-md text-body-md text-on-surface-variant">Creemos que tienes derecho a saber cuánto cuesta hacer tu ropa. Cada componente, desde la materia prima hasta el transporte, está contemplado.</p></div></div><div className="flex flex-col gap-gutter"><div className="flex-1 bg-surface-container-highest rounded-2xl p-8 flex flex-col justify-center soft-shadow"><Icon name="recycling" className="text-secondary mb-4 block text-3xl" /><h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Diseño circular</h3><p className="font-body-md text-body-md text-on-surface-variant text-sm">Prendas diseñadas para disfrutarse, repararse y eventualmente volver a la tierra.</p></div><div className="flex-1 bg-primary-container rounded-2xl p-8 flex flex-col justify-center soft-shadow"><Icon name="volunteer_activism" className="text-on-primary-container mb-4 block text-3xl" /><h3 className="font-headline-sm text-headline-sm text-on-primary-container mb-2">Trabajo justo</h3><p className="font-body-md text-body-md text-on-primary-container/80 text-sm">Trabajamos exclusivamente con fábricas certificadas que pagan salarios dignos.</p></div></div></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
