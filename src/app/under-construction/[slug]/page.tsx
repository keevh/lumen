import { redirect } from "next/navigation";

export default async function OldUnderConstructionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/en-construccion/${slug}`);
}
