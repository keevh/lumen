import type { Product } from "@/features/catalog/product.types";

export function hasVisibleDiscount(product: Product) {
  return typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
}

export function getProductPricing(product: Product) {
  const originalPrice = hasVisibleDiscount(product) ? product.compareAtPrice ?? product.price : product.price;
  const currentPrice = product.price;
  const discountAmount = Math.max(originalPrice - currentPrice, 0);
  const discountPercentage = originalPrice > currentPrice ? Math.round((discountAmount / originalPrice) * 100) : 0;

  return {
    currentPrice,
    originalPrice,
    discountAmount,
    discountPercentage,
    hasDiscount: discountAmount > 0,
  };
}
