"use client";

import Link from "next/link";
import { HoverSurface } from "@/components/motion/primitives";
import { getProductPricing } from "@/features/catalog/pricing";
import type { Product } from "@/features/catalog/product.types";
import { formatMoney } from "@/lib/format";

export function ProductCard({ product, variant = "soft" }: { product: Product; variant?: "soft" | "editorial" }) {
  const href = `/productos/${product.slug}`;
  const pricing = getProductPricing(product);

  if (variant === "editorial") {
    return (
      <HoverSurface>
        <Link className="product-card group block" href={href}>
          <div className="relative mb-stack-sm aspect-[3/4] overflow-hidden rounded-lg bg-surface-container">
            <img alt={product.displayName} className="product-image h-full w-full object-cover" src={product.image} />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            {pricing.hasDiscount ? <div className="absolute top-4 left-4"><span className="rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm text-on-primary">-{pricing.discountPercentage}%</span></div> : null}
            {product.badge ? <div className="absolute bottom-4 left-4"><span className="rounded-sm bg-secondary-fixed px-2 py-1 font-label-sm text-label-sm uppercase tracking-widest text-on-secondary-fixed">{product.badge}</span></div> : null}
          </div>
          <div className="flex items-start justify-between gap-4"><div><h3 className="mb-1 font-body-md text-body-md font-medium text-on-surface">{product.displayName}</h3><p className="font-label-sm text-label-sm text-on-surface-variant">{product.material}</p></div><div className="text-right"><span className="block font-body-md text-body-md text-primary">{formatMoney(pricing.currentPrice)}</span>{pricing.hasDiscount ? <span className="mt-1 block text-body-sm text-on-surface-variant line-through">{formatMoney(pricing.originalPrice)}</span> : null}</div></div>
        </Link>
      </HoverSurface>
    );
  }

  return (
    <HoverSurface>
      <Link className="group block rounded-lg bg-surface-container-lowest p-6 soft-shadow transition-soft" href={href}>
        <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded bg-surface-container-low">
          <img alt={product.displayName} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src={product.image} />
          {pricing.hasDiscount ? <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 font-label-caps text-[10px] text-on-primary">-{pricing.discountPercentage}%</div> : null}
          {product.badge ? <div className="absolute top-4 left-4 rounded bg-tertiary-container px-2 py-1 font-label-caps text-[10px] text-on-tertiary-container">{product.badge}</div> : null}
        </div>
        <div className="flex items-start justify-between gap-4"><div><h3 className="mb-1 font-headline-sm text-[20px] text-on-surface">{product.displayName}</h3><p className="font-body-md text-body-md text-on-surface-variant">{product.material}</p></div><div className="text-right"><span className="block font-body-md text-body-md text-primary">{formatMoney(pricing.currentPrice)}</span>{pricing.hasDiscount ? <span className="mt-1 block text-body-sm text-on-surface-variant line-through">{formatMoney(pricing.originalPrice)}</span> : null}</div></div>
      </Link>
    </HoverSurface>
  );
}
