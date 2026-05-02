"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/features/catalog/product.types";

type CategoryProductRailProps = {
  description: string;
  href: string;
  label: string;
  productCount: number;
  products: Product[];
};

export function CategoryProductRail({ description, href, label, productCount, products }: CategoryProductRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollRail(direction: "left" | "right") {
    railRef.current?.scrollBy({
      left: direction === "right" ? 340 : -340,
      behavior: "smooth",
    });
  }

  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-low px-5 py-6 soft-shadow md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-md text-headline-md text-on-surface">{label}</h2>
            <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs text-on-surface">{productCount}</span>
          </div>
          <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <div className="hidden items-center gap-2 md:flex">
            <button aria-label={`Desplazar ${label} a la izquierda`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface text-on-surface transition-all duration-200 hover:border-primary/40 hover:text-primary" type="button" onClick={() => scrollRail("left")}>
              <Icon className="text-[20px]" name="arrow_back" />
            </button>
            <button aria-label={`Desplazar ${label} a la derecha`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface text-on-surface transition-all duration-200 hover:border-primary/40 hover:text-primary" type="button" onClick={() => scrollRail("right")}>
              <Icon className="text-[20px]" name="arrow_forward" />
            </button>
          </div>

          <Link className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-primary transition-opacity duration-200 hover:opacity-70" href={href}>
            Ver más
            <Icon className="text-sm" name="north_east" />
          </Link>
        </div>
      </div>

      <div ref={railRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] flex-[0_0_260px] snap-start md:min-w-[300px] md:flex-[0_0_300px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
