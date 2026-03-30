import { BrowserProductPageClient } from "@/components/commerce/BrowserProductPageClient";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductDetailsClient } from "@/components/commerce/ProductDetailsClient";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getProductBySlug, listFeaturedProducts } from "@/features/catalog/catalog.repository";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return <BrowserProductPageClient slug={slug} />;

  const related = (await listFeaturedProducts()).filter((item) => item.slug !== product.slug).slice(0, 3);

  return <div className="theme-editorial antialiased min-h-screen flex flex-col font-body-md"><SiteHeader variant="editorial" active="Categories" /><main className="flex-grow pt-[100px] pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full"><section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-[128px]"><ProductGallery images={product.images} productName={product.displayName} /><ProductDetailsClient product={product} /></section><section><div className="flex justify-between items-end mb-stack-lg"><div><span className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2 block">También te puede interesar</span><h2 className="font-headline-lg text-headline-lg text-on-surface">Productos relacionados</h2></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">{related.map((item) => <ProductCard key={item.id} product={item} variant="editorial" />)}</div></section></main><SiteFooter /></div>;
}
