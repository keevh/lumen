import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Icon } from "@/components/ui/Icon";
import { catalogCategories } from "@/features/catalog/categories";
import { listCategoryProducts } from "@/features/catalog/catalog.repository";

export default async function CategoriesPage() {
  const categoriesWithCounts = await Promise.all(
    catalogCategories.map(async (category) => ({
      ...category,
      count: (await listCategoryProducts(category.slug)).length,
    })),
  );

  return (
    <div className="theme-editorial min-h-screen antialiased flex flex-col">
      <SiteHeader variant="editorial" active="Categories" />
      <main className="mx-auto w-full max-w-container-max-width flex-grow px-margin-mobile pb-margin-desktop pt-[100px] md:px-margin-desktop">
        <section className="mx-auto mt-stack-lg max-w-3xl text-center">
          <span className="mb-2 block font-label-md text-label-md uppercase tracking-widest text-secondary">Categorías</span>
          <h1 className="font-display-lg text-[48px] leading-[1.1] tracking-[-0.02em] text-on-surface md:text-[64px]">Encuentra lo que estás buscando</h1>
          <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">Explora la categoría que mejor se ajusta a tu estilo. LUMEN organiza la colección para que encuentres camisas, pantalones, zapatos y más con facilidad.</p>
        </section>

        <section className="mt-12 grid gap-gutter sm:grid-cols-2 xl:grid-cols-3">
          {categoriesWithCounts.map((category) => (
            <Link key={category.slug} className="group rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 soft-shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.99]" href={`/categorias/${category.slug}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">{category.label}</p>
                  <p className="mt-2 text-body-md text-on-surface-variant">{category.description}</p>
                </div>
                <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs text-on-surface">{category.count}</span>
              </div>
              <div className="mt-6 flex items-center justify-between text-primary">
                <span className="font-label-md text-label-md uppercase tracking-widest">Explorar</span>
                <Icon name="arrow_forward" className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
