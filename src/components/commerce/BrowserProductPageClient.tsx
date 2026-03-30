"use client";

import { useEffect, useState } from "react";
import { ProductDetailsClient } from "@/components/commerce/ProductDetailsClient";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { Product } from "@/features/catalog/product.types";
import { createBrowserRepositories } from "@/shared/storage/repositories";

export function BrowserProductPageClient({ initialProduct, slug }: { initialProduct?: Product; slug: string }) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null);
  const [isLoading, setIsLoading] = useState(!initialProduct);

  useEffect(() => {
    let isMounted = true;
    createBrowserRepositories().catalog.getProductBySlug(slug).then((browserProduct) => {
      if (!isMounted) return;
      setProduct(browserProduct ?? initialProduct ?? null);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
    return () => { isMounted = false; };
  }, [initialProduct, slug]);

  return (
    <div className="theme-editorial antialiased min-h-screen flex flex-col font-body-md">
      <SiteHeader variant="editorial" active="Categories" />
      <main className="flex-grow pt-[100px] pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full">
        {product ? <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-[128px]"><ProductGallery images={product.images} productName={product.displayName} /><ProductDetailsClient product={product} /></section> : <section className="lumen-card p-8 text-center">{isLoading ? "Cargando producto..." : "No encontramos este producto."}</section>}
      </main>
      <SiteFooter />
    </div>
  );
}
