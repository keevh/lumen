"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { CatalogCategory } from "@/features/catalog/categories";
import { productMatchesCategory } from "@/features/catalog/categories";
import type { Product } from "@/features/catalog/product.types";
import { createBrowserRepositories } from "@/shared/storage/repositories";

type SortOption = "newest" | "price-asc" | "price-desc" | "name";
type AvailabilityOption = "all" | "available" | "unavailable";

const colorLabels: Record<string, string> = {
  Beige: "Beige",
  Oat: "Avena",
  "Off-White": "Blanco roto",
  Sage: "Salvia",
  Sand: "Arena",
};

function sortProducts(products: Product[], sort: SortOption) {
  return [...products].sort((left, right) => {
    if (sort === "price-asc") return left.price - right.price;
    if (sort === "price-desc") return right.price - left.price;
    if (sort === "name") return left.displayName.localeCompare(right.displayName, "es");
    return right.createdAt.localeCompare(left.createdAt) || left.displayName.localeCompare(right.displayName, "es");
  });
}

export function CatalogCollectionClient({ products, category }: { products: Product[]; category: CatalogCategory }) {
  const [browserProducts, setBrowserProducts] = useState(products);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState<AvailabilityOption>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    let isMounted = true;
    createBrowserRepositories().catalog.listActiveProducts().then((nextProducts) => {
      if (isMounted) setBrowserProducts(nextProducts);
    }).catch(() => undefined);
    return () => { isMounted = false; };
  }, []);

  const visibleProducts = browserProducts.filter((product) => productMatchesCategory(product, category));
  const sizes = useMemo(() => Array.from(new Set(visibleProducts.flatMap((product) => product.sizes))).sort(), [visibleProducts]);
  const colors = useMemo(() => Array.from(new Set(visibleProducts.flatMap((product) => product.colors))).sort(), [visibleProducts]);

  const filteredProducts = useMemo(() => {
    const min = minPrice ? Number(minPrice) : Number.NEGATIVE_INFINITY;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;

    return sortProducts(
      visibleProducts.filter((product) => {
        if (selectedSizes.length > 0 && !selectedSizes.some((size) => product.sizes.includes(size))) return false;
        if (selectedColors.length > 0 && !selectedColors.some((color) => product.colors.includes(color))) return false;
        if (product.price < min || product.price > max) return false;
        if (availability === "available" && product.stock <= 0) return false;
        if (availability === "unavailable" && product.stock > 0) return false;
        return true;
      }),
      sort,
    );
  }, [availability, maxPrice, minPrice, selectedColors, selectedSizes, sort, visibleProducts]);

  function toggleValue(value: string, selected: string[], setter: (next: string[]) => void) {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  function clearFilters() {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSort("newest");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-gutter">
      <aside className="w-full lg:w-1/4 flex-shrink-0 mb-stack-lg lg:mb-0">
        <div className="sticky top-[120px] glass-panel rounded-xl p-gutter border border-surface-variant ambient-shadow">
          <div className="flex justify-between items-center gap-stack-sm"><h2 className="font-headline-md text-headline-md text-on-surface">Filtros</h2><button className="rounded-full border border-outline-variant px-4 py-2 font-label-sm text-label-sm text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-variant active:translate-y-0 active:scale-[0.99]" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((current) => !current)}>{filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}</button></div>
          {filtersOpen ? <div className="mt-stack-md"><button className="mb-stack-md font-label-sm text-label-sm text-primary transition-colors duration-200 hover:underline" type="button" onClick={clearFilters}>Limpiar filtros</button><div className="border-t border-surface-variant py-stack-md"><h3 className="font-body-md text-body-md font-medium text-on-surface mb-stack-sm">Talla</h3><div className="flex flex-wrap gap-stack-sm">{sizes.map((size) => <button key={size} type="button" onClick={() => toggleValue(size, selectedSizes, setSelectedSizes)} className={`inline-block rounded-full border px-3 py-1 font-label-sm text-label-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${selectedSizes.includes(size) ? "bg-secondary text-on-secondary border-secondary" : "border-outline-variant text-on-surface-variant"}`}>{size}</button>)}</div></div>
          <div className="border-t border-surface-variant py-stack-md"><h3 className="font-body-md text-body-md font-medium text-on-surface mb-stack-sm">Color</h3><div className="flex flex-wrap gap-stack-sm">{colors.map((color) => <button key={color} type="button" onClick={() => toggleValue(color, selectedColors, setSelectedColors)} className={`rounded-full border px-3 py-1 font-label-sm text-label-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${selectedColors.includes(color) ? "bg-secondary text-on-secondary border-secondary" : "border-outline-variant text-on-surface-variant"}`}>{colorLabels[color] ?? color}</button>)}</div></div>
          <div className="border-t border-surface-variant py-stack-md"><h3 className="font-body-md text-body-md font-medium text-on-surface mb-stack-sm">Precio</h3><div className="grid grid-cols-2 gap-stack-sm"><label className="font-label-sm text-label-sm text-on-surface-variant">Mínimo<input className="mt-1 w-full rounded border border-outline-variant bg-surface px-3 py-2 text-on-surface" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} type="number" /></label><label className="font-label-sm text-label-sm text-on-surface-variant">Máximo<input className="mt-1 w-full rounded border border-outline-variant bg-surface px-3 py-2 text-on-surface" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" /></label></div></div>
          <div className="border-t border-surface-variant py-stack-md"><label className="font-body-md text-body-md font-medium text-on-surface" htmlFor="availability-filter">Disponibilidad</label><select id="availability-filter" className="mt-stack-sm w-full rounded border border-outline-variant bg-surface px-3 py-2 text-on-surface" value={availability} onChange={(event) => setAvailability(event.target.value as AvailabilityOption)}><option value="all">Todas</option><option value="available">Disponible</option><option value="unavailable">Sin existencias</option></select></div></div> : <p className="mt-stack-md text-body-sm text-on-surface-variant">Abre los filtros para ajustar talla, color, precio o disponibilidad.</p>}
        </div>
      </aside>
      <section className="flex-grow"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-lg gap-stack-sm"><p className="font-body-md text-body-md text-on-surface-variant">{filteredProducts.length} productos</p><label className="font-label-sm text-label-sm text-on-surface-variant">Ordenar por <select className="ml-2 rounded border border-outline-variant bg-surface px-3 py-2 text-on-surface" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="newest">Más nuevos</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre</option></select></label></div>{filteredProducts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} variant="editorial" />)}</div> : <div className="rounded-xl border border-surface-variant bg-surface-container-low p-gutter text-center"><h3 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">No se encontraron productos</h3><p className="font-body-md text-body-md text-on-surface-variant">Prueba ajustar los filtros para ver más opciones.</p></div>}</section>
    </div>
  );
}
