import type { Product } from "@/features/catalog/product.types";

export type CatalogCategory = {
  slug: string;
  label: string;
  description: string;
  matchTerms: string[];
};

export const catalogCategories: CatalogCategory[] = [
  { slug: "camisas", label: "Camisas", description: "Camisas livianas y atemporales para todos los días.", matchTerms: ["camisas", "camisa", "shirt", "linen"] },
  { slug: "pantalones", label: "Pantalones", description: "Pantalones cómodos, fluidos y fáciles de combinar.", matchTerms: ["pantalones", "pantalón", "pantalon", "trouser"] },
  { slug: "abrigos", label: "Abrigos", description: "Capas cálidas y estructuradas para acompañar la temporada.", matchTerms: ["abrigos", "abrigo", "blazer", "sweater"] },
  { slug: "zapatos", label: "Zapatos", description: "Calzado seleccionado para completar el guardarropa esencial.", matchTerms: ["zapatos", "zapato", "shoe", "shoes"] },
  { slug: "vestidos", label: "Vestidos", description: "Vestidos serenos con siluetas simples y cuidadas.", matchTerms: ["vestidos", "vestido", "dress"] },
];

export function getCategoryBySlug(slug: string) {
  return catalogCategories.find((category) => category.slug === slug) ?? null;
}

export function productMatchesCategory(product: Product, category: CatalogCategory) {
  const searchable = [product.category, product.displayName, product.name, product.slug].join(" ").toLowerCase();
  return category.matchTerms.some((term) => searchable.includes(term.toLowerCase()));
}
