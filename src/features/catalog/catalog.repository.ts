import { products } from "@/data/catalog";
import { getCategoryBySlug, productMatchesCategory } from "@/features/catalog/categories";
import { hasVisibleDiscount } from "@/features/catalog/pricing";
import type { ProductFilters } from "@/features/catalog/product.types";

function matchesProductFilters(product: (typeof products)[number], filters?: ProductFilters) {
  if (!filters) return true;
  if (filters.category && product.category !== filters.category) return false;
  if (filters.status && product.status !== filters.status) return false;
  return true;
}

export async function listFeaturedProducts() {
  return products.filter((product) => product.status === "active").slice(0, 3);
}

export async function listProducts(filters?: ProductFilters) {
  return products.filter((product) => matchesProductFilters(product, filters));
}

export async function listOfferProducts() {
  return products.filter((product) => product.status === "active" && hasVisibleDiscount(product));
}

export async function listLinenProducts() {
  return listProducts({ status: "active", category: "Linen" });
}

export async function listCategoryProducts(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return products.filter((product) => product.status === "active" && productMatchesCategory(product, category));
}

export async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug && product.status === "active") ?? null;
}
