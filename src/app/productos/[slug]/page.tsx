import { BrowserProductPageClient } from "@/components/commerce/BrowserProductPageClient";
import { getProductBySlug } from "@/features/catalog/catalog.repository";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return <BrowserProductPageClient initialProduct={product ?? undefined} slug={slug} />;
}
