"use client";

import { useEffect, useState } from "react";
import { ProductDetailsClient } from "@/components/commerce/ProductDetailsClient";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Product } from "@/features/catalog/product.types";
import { createBrowserRepositories } from "@/shared/storage/repositories";

export function BrowserProductPageClient({ initialProduct, slug }: { initialProduct?: Product; slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(initialProduct?.colors.length === 1 ? initialProduct.colors[0] : undefined);

  useEffect(() => {
    let isMounted = true;
    const repositories = createBrowserRepositories();

    Promise.all([
      repositories.catalog.getProductBySlug(slug),
      repositories.catalog.listActiveProducts(),
    ])
      .then(([browserProduct, browserProducts]) => {
        if (!isMounted) return;

        const resolvedProduct = browserProduct ?? initialProduct ?? null;
        setProduct(resolvedProduct);
        setSelectedColor(resolvedProduct?.colors.length === 1 ? resolvedProduct.colors[0] : undefined);

        if (resolvedProduct) {
          const nextRelated = browserProducts
            .filter((item) => item.slug !== resolvedProduct.slug)
            .sort((left, right) => Number(right.category === resolvedProduct.category) - Number(left.category === resolvedProduct.category))
            .slice(0, 3);
          setRelatedProducts(nextRelated);
        } else {
          setRelatedProducts([]);
        }

        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setProduct(initialProduct ?? null);
        setRelatedProducts([]);
        setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [initialProduct, slug]);

  return (
    <PublicPageTransition className="theme-editorial antialiased min-h-screen flex flex-col font-body-md">
      <SiteHeader variant="editorial" active="Categories" />
      <main className="flex-grow pt-[100px] pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full">
        {product ? <><ScrollReveal as="section" className="mb-16 grid grid-cols-1 gap-gutter md:mb-[128px] md:grid-cols-12"><ProductGallery images={product.images} productName={product.displayName} selectedColor={selectedColor} /><ProductDetailsClient key={product.id} product={product} selectedColor={selectedColor} onColorChange={setSelectedColor} /></ScrollReveal>{relatedProducts.length > 0 ? <section><ScrollReveal className="mb-stack-lg flex justify-between items-end"><div><span className="mb-2 block font-label-md text-label-md uppercase tracking-widest text-secondary">También te puede interesar</span><h2 className="font-headline-lg text-headline-lg text-on-surface">Productos relacionados</h2></div></ScrollReveal><div className="grid grid-cols-1 gap-gutter md:grid-cols-3">{relatedProducts.map((item, index) => <ScrollReveal key={item.id} delay={index * 60}><ProductCard product={item} variant="editorial" /></ScrollReveal>)}</div></section> : null}</> : <section className="lumen-card p-8 text-center">{isLoading ? "Cargando producto..." : "No encontramos este producto."}</section>}
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
