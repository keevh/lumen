"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { Icon } from "@/components/ui/Icon";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <PublicPageTransition className="min-h-screen bg-background text-on-background flex flex-col">
      <header className="w-full bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 border-b border-outline-variant/10">
        <Link className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tighter text-primary" href="/">LUMEN</Link>
      </header>
      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto flex items-center justify-center">
        <section className="lumen-card p-8 md:p-12 text-center max-w-2xl">
          <Icon name="check_circle" className="text-6xl text-primary mb-5" />
          <h1 className="font-headline-md text-headline-md text-on-surface mb-3">Pedido confirmado</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">Gracias por tu compra. Registramos tu pedido correctamente.</p>
          {orderId ? <p className="font-body-md text-body-md text-on-surface-variant mb-8">Número de pedido: <span className="text-on-surface">{orderId}</span></p> : null}
          <Link className="inline-flex rounded bg-primary px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" href="/categorias">
            Seguir comprando
          </Link>
        </section>
      </main>
    </PublicPageTransition>
  );
}
