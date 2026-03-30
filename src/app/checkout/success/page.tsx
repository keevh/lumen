import { redirect } from "next/navigation";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  redirect(order ? `/pago/exito?order=${encodeURIComponent(order)}` : "/pago/exito");
}
