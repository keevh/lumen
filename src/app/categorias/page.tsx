import Link from "next/link";
import { CategoryProductRail } from "@/components/commerce/CategoryProductRail";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { catalogCategories } from "@/features/catalog/categories";
import { listCategoryProducts } from "@/features/catalog/catalog.repository";

export default async function CategoriesPage() {
  const categoriesWithProducts = await Promise.all(
    catalogCategories.map(async (category) => ({
      ...category,
      products: await listCategoryProducts(category.slug),
    })),
  );

  const visibleCategories = categoriesWithProducts.filter((category) => category.products.length > 0);

  return (
    <PublicPageTransition className="theme-editorial min-h-screen antialiased flex flex-col">
      <SiteHeader active="Categories" />
      <main className="mx-auto w-full max-w-container-max-width flex-grow px-margin-mobile pb-margin-desktop pt-[100px] md:px-margin-desktop">
        <ScrollReveal as="section" className="mx-auto mt-stack-lg max-w-3xl text-center">
          <span className="mb-2 block font-label-md text-label-md uppercase tracking-widest text-secondary">Categorías</span>
          <h1 className="font-display-lg text-[48px] leading-[1.1] tracking-[-0.02em] text-on-surface md:text-[64px]">Encuentra lo que estás buscando</h1>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">Explora cada línea de producto en una vista más cómoda. Recorre camisas, pantalones, zapatos y más desde una sola página.</p>
        </ScrollReveal>

        {visibleCategories.length > 0 ? (
          <section className="mt-12 space-y-8">
            {visibleCategories.map((category, index) => (
              <ScrollReveal key={category.slug} delay={index * 70}>
                <CategoryProductRail description={category.description} href={`/categorias/${category.slug}`} label={category.label} productCount={category.products.length} products={category.products.slice(0, 8)} />
              </ScrollReveal>
            ))}
          </section>
        ) : (
          <ScrollReveal as="section" className="mt-12 rounded-[28px] border border-outline-variant/20 bg-surface-container-low px-6 py-12 text-center soft-shadow md:px-10">
            <h2 className="font-headline-md text-headline-md text-on-surface">Todavía no hay categorías disponibles</h2>
            <p className="mt-3 font-body-md text-body-md text-on-surface-variant">En cuanto publiquemos productos, vas a poder explorarlos desde acá por tipo de prenda.</p>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-button text-button text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-tint active:translate-y-0 active:scale-[0.99]" href="/ofertas">
              Ver ofertas actuales
              <Icon className="text-sm" name="arrow_forward" />
            </Link>
          </ScrollReveal>
        )}
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
