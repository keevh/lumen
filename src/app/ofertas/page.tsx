import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { listOfferProducts } from "@/features/catalog/catalog.repository";
import { OffersPageClient } from "@/features/catalog/OffersPageClient";

export default async function OffersPage() {
  const products = await listOfferProducts();

  return (
    <PublicPageTransition className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader active="Ofertas" />
      <main className="flex-grow pt-[100px]">
        <OffersPageClient initialProducts={products} />
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
