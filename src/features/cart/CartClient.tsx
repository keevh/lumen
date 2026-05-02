"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toast, useTimedToast } from "@/components/ui/Toast";
import { PublicPageTransition } from "@/components/ui/PublicPageTransition";
import { Icon } from "@/components/ui/Icon";
import type { Cart } from "@/features/cart/cart.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  updatedAt: "",
};

export function CartClient() {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const repositories = useBrowserRepositories();
  const { message, tone, showToast } = useTimedToast();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!repositories) return;
    const browserRepositories = repositories;

    let isMounted = true;

    async function loadCart() {
      try {
        const nextCart = await browserRepositories.cart.getCart();
        if (isMounted) setCart(nextCart);
      } catch {
        if (isMounted) setError("No pudimos cargar tu carrito. Intenta nuevamente.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, [repositories]);

  async function updateQuantity(itemId: string, quantity: number) {
    setError("");
    if (!repositories) return;

    const currentItem = cart.items.find((item) => item.id === itemId);
    try {
      setCart(await repositories.cart.updateQuantity(itemId, quantity));

      if (currentItem && quantity <= 0) {
        showToast(`${currentItem.name} se quitó del carrito.`);
      }
    } catch {
      setError("No pudimos actualizar la cantidad. Intenta nuevamente.");
      showToast("No pudimos actualizar la cantidad del producto.", "error");
    }
  }

  async function removeItem(itemId: string) {
    setError("");
    if (!repositories) return;

    const currentItem = cart.items.find((item) => item.id === itemId);
    try {
      setCart(await repositories.cart.removeItem(itemId));
      if (currentItem) {
        showToast(`${currentItem.name} se quitó del carrito.`);
      }
    } catch {
      setError("No pudimos quitar el producto. Intenta nuevamente.");
      showToast("No pudimos quitar el producto del carrito.", "error");
    }
  }

  const hasItems = cart.items.length > 0;

  return (
    <PublicPageTransition className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      <Toast message={message} tone={tone} />
      <SiteHeader />
      <main className="flex-grow pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Tu carrito</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Revisa los productos seleccionados antes de continuar.</p>
        </div>

        {error ? <p className="mb-6 rounded bg-error-container px-4 py-3 text-on-error-container" role="alert">{error}</p> : null}

        {isLoading ? (
          <section className="lumen-card p-8 text-on-surface-variant">Cargando carrito...</section>
        ) : hasItems ? (
          <div className="flex flex-col lg:flex-row gap-gutter">
             <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {cart.items.map((item) => (
                  <motion.article
                    key={item.id}
                    className="flex items-start gap-6 rounded-lg bg-surface-container-lowest p-6 soft-shadow sm:flex-row sm:items-center"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img alt={item.name} className="h-24 w-24 rounded bg-surface-container object-cover" src={item.image} />
                    <div className="flex w-full flex-grow flex-col justify-between gap-4 sm:flex-row">
                      <div className="flex flex-col gap-1">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">{item.variant}</p>
                        <span className="mt-2 font-label-caps text-label-caps text-primary">Disponible</span>
                      </div>
                      <div className="flex items-center gap-6 sm:gap-8">
                        <div className="flex items-center rounded border border-outline-variant/30">
                          <button aria-label="Disminuir cantidad" className="px-3 py-2 text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Icon name="remove" className="text-sm" />
                          </button>
                          <span className="w-8 text-center font-body-md text-body-md text-on-surface">{item.quantity}</span>
                          <button aria-label="Aumentar cantidad" className="px-3 py-2 text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Icon name="add" className="text-sm" />
                          </button>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-body-lg text-body-lg text-on-surface">{formatMoney(item.unitPrice * item.quantity)}</span>
                          <button className="text-label-sm font-label-sm text-error hover:underline" type="button" onClick={() => removeItem(item.id)}>Quitar</button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <aside className="w-full lg:w-1/3">
              <div className="bg-surface-container-lowest rounded-lg p-6 soft-shadow sticky top-28">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Resumen del pedido</h2>
                <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-6 mb-6">
                  <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Descuentos</span><span>{formatMoney(0)}</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Impuestos</span><span>{formatMoney(cart.tax)}</span></div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
                  <span className="font-headline-sm text-headline-sm text-primary">{formatMoney(cart.total)}</span>
                </div>
                <Link className="flex w-full items-center justify-center gap-2 rounded bg-primary py-4 font-label-md text-label-md uppercase tracking-widest text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" href="/pago">
                  Continuar al pago <Icon name="arrow_forward" />
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          <section className="lumen-card p-8 md:p-12 text-center max-w-2xl mx-auto">
            <Icon name="shopping_bag" className="text-5xl text-primary mb-4" />
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Tu carrito está vacío</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">Explora la colección y agrega prendas para iniciar tu pedido.</p>
            <Link className="inline-flex rounded bg-primary px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" href="/categorias">
              Ver categorías
            </Link>
          </section>
        )}
      </main>
      <SiteFooter />
    </PublicPageTransition>
  );
}
