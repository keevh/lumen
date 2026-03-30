import Link from "next/link";
import type { Product } from "@/features/catalog/product.types";
import { formatMoney } from "@/lib/format";

export function ProductCard({ product, variant = "soft" }: { product: Product; variant?: "soft" | "editorial" }) {
  const href = `/productos/${product.slug}`;

  if (variant === "editorial") {
    return (
      <Link className="product-card group block" href={href}>
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-container rounded-lg mb-stack-sm">
          <img alt={product.displayName} className="product-image object-cover w-full h-full" src={product.image} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          {product.badge ? <div className="absolute bottom-4 left-4"><span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-1 rounded-sm uppercase tracking-widest">{product.badge}</span></div> : null}
        </div>
        <div className="flex justify-between items-start"><div><h3 className="font-body-md text-body-md font-medium text-on-surface mb-1">{product.displayName}</h3><p className="font-label-sm text-label-sm text-on-surface-variant">{product.material}</p></div><span className="font-body-md text-body-md text-primary">{formatMoney(product.price)}</span></div>
      </Link>
    );
  }

  return (
    <Link className="group block bg-surface-container-lowest rounded-lg p-6 soft-shadow soft-shadow-hover transition-soft" href={href}>
      <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded bg-surface-container-low">
        <img alt={product.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src={product.image} />
        {product.badge ? <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container font-label-caps text-[10px] px-2 py-1 rounded">{product.badge}</div> : null}
      </div>
      <div className="flex justify-between items-start"><div><h3 className="font-headline-sm text-[20px] text-on-surface mb-1">{product.displayName}</h3><p className="font-body-md text-body-md text-on-surface-variant">{product.material}</p></div><span className="font-body-md text-body-md text-primary">{formatMoney(product.price)}</span></div>
    </Link>
  );
}
