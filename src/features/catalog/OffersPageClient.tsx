"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Product } from "@/features/catalog/product.types";
import { getProductPricing, hasVisibleDiscount } from "@/features/catalog/pricing";
import { formatMoney } from "@/lib/format";
import { createBrowserRepositories } from "@/shared/storage/repositories";

export function OffersPageClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const hasOffers = products.length > 0;

  useEffect(() => {
    let isMounted = true;

    createBrowserRepositories().catalog.listActiveProducts()
      .then((nextProducts) => {
        if (!isMounted) return;
        setProducts(nextProducts.filter(hasVisibleDiscount));
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSavings = useMemo(
    () => products.reduce((sum, product) => sum + getProductPricing(product).discountAmount, 0),
    [products],
  );

  const maxSavings = useMemo(
    () => Math.max(...products.map((product) => getProductPricing(product).discountAmount), 0),
    [products],
  );

  return (
    <>
      <ScrollReveal as="section" className="border-b border-outline-variant/20 bg-surface-container-low px-margin-mobile py-16 md:px-margin-desktop md:py-20">
        <div className="mx-auto grid max-w-container-max items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-secondary">Ofertas vigentes</span>
            <h1 className="font-display-lg text-display-lg-mobile text-on-surface md:text-display-lg">{hasOffers ? "Descuentos reales en prendas seleccionadas" : "Estamos preparando nuevas ofertas para vos"}</h1>
            <p className="mt-4 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">{hasOffers ? "Encuentra productos con precio reducido visible dentro del catálogo. Sin enlaces de relleno, sin promesas vacías." : "Esta página se alimenta del catálogo real. Apenas publiquemos prendas con precio reducido visible, vas a verlas acá con acceso directo a compra."}</p>
          </div>
          <div className="grid gap-4 rounded-3xl bg-surface p-6 soft-shadow sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Productos en oferta</p>
              <p className="mt-2 font-headline-lg text-headline-lg text-primary">{products.length}</p>
            </div>
            <div>
              <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Ahorro por prenda</p>
              <p className="mt-2 font-headline-lg text-headline-lg text-primary">Hasta {formatMoney(maxSavings)}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <section className="mx-auto w-full max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
        {products.length > 0 ? (
          <>
            <ScrollReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Selección comercial de temporada</h2>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">Ahorro total visible en esta selección: {formatMoney(totalSavings)} por unidad antes de impuestos.</p>
              </div>
              <Link className="font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity hover:opacity-70" href="/categorias">Seguir explorando categorías</Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 60}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </>
        ) : (
          <ScrollReveal className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-6 py-12 text-center soft-shadow md:px-10">
            <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-secondary">Sin ofertas activas</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Por ahora no hay ofertas publicadas</h2>
            <p className="mx-auto mt-3 max-w-2xl font-body-md text-body-md text-on-surface-variant">Espera nuestras ofertas. Cuando una prenda tenga un precio reducido visible dentro del catálogo, la vas a encontrar aquí con toda la información lista para comprar.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link className="inline-flex rounded-full bg-primary px-6 py-3 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/categorias">Ver categorías</Link>
              <Link className="font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity hover:opacity-70" href="/novedades">Explorar novedades</Link>
            </div>
          </ScrollReveal>
        )}
      </section>
    </>
  );
}
