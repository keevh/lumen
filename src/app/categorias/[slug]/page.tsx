import { notFound } from "next/navigation";
import { CatalogCollectionClient } from "@/components/commerce/CatalogCollectionClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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

  return (
    <PublicPageTransition className="theme-editorial antialiased min-h-screen flex flex-col">
      <SiteHeader variant="editorial" active="Categories" />
      <main className="mx-auto w-full max-w-container-max-width flex-grow px-margin-mobile pb-margin-desktop pt-[100px] md:px-margin-desktop">
        <ScrollReveal className="mx-auto mb-margin-desktop mt-stack-lg max-w-2xl text-center">
          <span className="mb-2 block font-label-md text-label-md uppercase tracking-widest text-secondary">Categoría</span>
          <h1 className="mb-stack-md font-display-lg text-[64px] font-medium leading-[1.1] tracking-[-0.02em] text-on-surface">{category.label}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{category.description}</p>
        </ScrollReveal>

        <CatalogCollectionClient products={products} category={category} />
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
