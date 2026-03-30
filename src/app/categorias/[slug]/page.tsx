import { notFound } from "next/navigation";
import { CatalogCollectionClient } from "@/components/commerce/CatalogCollectionClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { catalogCategories, getCategoryBySlug } from "@/features/catalog/categories";
import { listCategoryProducts } from "@/features/catalog/catalog.repository";

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = await listCategoryProducts(category.slug);

  return <div className="theme-editorial antialiased min-h-screen flex flex-col"><SiteHeader variant="editorial" active="Categories" /><main className="flex-grow pt-[100px] pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full"><div className="mb-margin-desktop mt-stack-lg text-center max-w-2xl mx-auto"><span className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-2 block">Categoría</span><h1 className="font-display-lg text-[64px] leading-[1.1] tracking-[-0.02em] font-medium text-on-surface mb-stack-md">{category.label}</h1><p className="font-body-lg text-body-lg text-on-surface-variant">{category.description}</p></div><CatalogCollectionClient products={products} category={category} /></main><SiteFooter /></div>;
}
