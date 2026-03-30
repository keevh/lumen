"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Cart } from "@/features/cart/cart.types";
import type { Order } from "@/features/orders/order.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

const checkoutDraftKey = "lumens-checkout-draft";

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  updatedAt: "",
};

type CheckoutDraft = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  zip: string;
  phone: string;
  paymentMethod: string;
};

const initialDraft: CheckoutDraft = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  zip: "",
  phone: "",
  paymentMethod: "card",
};

type DraftErrors = Partial<Record<keyof CheckoutDraft, string>>;

export function CheckoutClient() {
  const router = useRouter();
  const repositories = useBrowserRepositories();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [draft, setDraft] = useState<CheckoutDraft>(initialDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const savedDraft = sessionStorage.getItem(checkoutDraftKey);
    if (savedDraft) {
      try {
        setDraft({ ...initialDraft, ...JSON.parse(savedDraft) });
      } catch {
        sessionStorage.removeItem(checkoutDraftKey);
      }
    }

    if (!repositories) return;
    const browserRepositories = repositories;

    let isMounted = true;
    async function loadCart() {
      try {
        const nextCart = await browserRepositories.cart.getCart();
        if (isMounted) setCart(nextCart);
      } catch {
        if (isMounted) setSubmitError("No pudimos cargar el resumen del pedido. Intenta nuevamente.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, [repositories]);

  useEffect(() => {
    sessionStorage.setItem(checkoutDraftKey, JSON.stringify(draft));
  }, [draft]);

  function updateField(field: keyof CheckoutDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateDraft() {
    const nextErrors: DraftErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(draft.email)) nextErrors.email = "Ingresá un email válido.";
    if (!draft.firstName.trim()) nextErrors.firstName = "Ingresá tu nombre.";
    if (!draft.lastName.trim()) nextErrors.lastName = "Ingresá tu apellido.";
    if (!draft.address.trim()) nextErrors.address = "Ingresá una dirección.";
    if (!draft.city.trim()) nextErrors.city = "Ingresá una ciudad.";
    if (!draft.zip.trim()) nextErrors.zip = "Ingresá un código postal.";
    if (!draft.phone.trim()) nextErrors.phone = "Ingresá un teléfono.";
    if (!draft.paymentMethod) nextErrors.paymentMethod = "Selecciona un medio de pago.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (cart.items.length === 0) {
      setSubmitError("Tu carrito está vacío. Agregá productos antes de pagar.");
      return;
    }

    if (!validateDraft()) return;

    if (!repositories) {
      setSubmitError("Todavía estamos preparando el pago. Intenta nuevamente en unos segundos.");
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();
    const order: Order = {
      id: `order-${Date.now()}`,
      status: "pending",
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      discountTotal: 0,
      total: cart.total,
      customerEmail: draft.email,
      customerName: `${draft.firstName.trim()} ${draft.lastName.trim()}`,
      shippingAddress: {
        address: draft.address,
        apartment: draft.apartment || undefined,
        city: draft.city,
        zip: draft.zip,
        phone: draft.phone,
      },
      paymentMethod: draft.paymentMethod,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await repositories.orders.saveOrder(order);
      await repositories.cart.clearCart();
      sessionStorage.removeItem(checkoutDraftKey);
      router.push(`/pago/exito?order=${order.id}`);
    } catch {
      setSubmitError("No pudimos registrar el pedido. Revisá los datos e intentá nuevamente.");
      setIsSubmitting(false);
    }
  }

  const hasItems = cart.items.length > 0;

  return (
    <div className="font-body-md text-on-background min-h-screen flex flex-col bg-background">
      <header className="w-full bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 border-b border-outline-variant/10">
        <Link className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tighter text-primary" href="/">LUMEN</Link>
        <div className="flex items-center gap-2 text-on-surface-variant"><Icon name="lock" className="text-xl" /><span className="font-label-caps text-label-caps">Pago seguro</span></div>
      </header>

      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="mb-12">
          <h1 className="font-headline-md text-headline-md text-on-background mb-2">Finalizar compra</h1>
          <p className="font-body-md text-on-surface-variant">Completá tus datos para crear el pedido.</p>
        </div>

        {isLoading ? (
          <section className="lumen-card p-8 text-on-surface-variant">Cargando resumen...</section>
        ) : hasItems ? (
          <form className="grid grid-cols-1 lg:grid-cols-12 gap-gutter" onSubmit={submitOrder} noValidate>
            <div className="lg:col-span-7 space-y-8">
              <section className="lumen-card p-6 md:p-8">
                <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Datos de contacto</h2>
                <TextField error={errors.email} label="Correo electrónico" type="email" value={draft.email} onChange={(value) => updateField("email", value)} />
              </section>

              <section className="lumen-card p-6 md:p-8">
                <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Dirección de envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField error={errors.firstName} label="Nombre" value={draft.firstName} onChange={(value) => updateField("firstName", value)} />
                  <TextField error={errors.lastName} label="Apellido" value={draft.lastName} onChange={(value) => updateField("lastName", value)} />
                  <TextField className="md:col-span-2" error={errors.address} label="Dirección" value={draft.address} onChange={(value) => updateField("address", value)} />
                  <TextField className="md:col-span-2" label="Departamento, piso, etc. (opcional)" value={draft.apartment} onChange={(value) => updateField("apartment", value)} />
                  <TextField error={errors.city} label="Ciudad" value={draft.city} onChange={(value) => updateField("city", value)} />
                  <TextField error={errors.zip} label="Código postal" value={draft.zip} onChange={(value) => updateField("zip", value)} />
                  <TextField className="md:col-span-2" error={errors.phone} label="Teléfono" type="tel" value={draft.phone} onChange={(value) => updateField("phone", value)} />
                </div>
              </section>

              <section className="lumen-card p-6 md:p-8">
                <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Medio de pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentOption checked={draft.paymentMethod === "card"} label="Tarjeta de crédito o débito" onChange={() => updateField("paymentMethod", "card")} />
                  <PaymentOption checked={draft.paymentMethod === "transfer"} label="Transferencia bancaria" onChange={() => updateField("paymentMethod", "transfer")} />
                </div>
                {errors.paymentMethod ? <p className="mt-3 text-error text-body-md">{errors.paymentMethod}</p> : null}
              </section>
            </div>

            <aside className="lg:col-span-5">
              <div className="lumen-card p-6 md:p-8 sticky top-28">
                <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Resumen del pedido</h2>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img alt={item.name} className="h-16 w-16 rounded object-cover bg-surface-container" src={item.image} />
                      <div className="flex-grow">
                        <p className="font-body-md text-body-md text-on-surface">{item.name}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.variant} · Cantidad {item.quantity}</p>
                      </div>
                      <span className="text-on-surface">{formatMoney(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-outline-variant/20 pt-6 space-y-3">
                  <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal)} />
                  <SummaryRow label="Descuentos" value={formatMoney(0)} />
                  <SummaryRow label="Impuestos" value={formatMoney(cart.tax)} />
                  <div className="flex justify-between pt-3 font-headline-sm text-headline-sm text-on-surface"><span>Total</span><span className="text-primary">{formatMoney(cart.total)}</span></div>
                </div>
                {submitError ? <p className="mt-4 rounded bg-error-container px-4 py-3 text-on-error-container" role="alert">{submitError}</p> : null}
                <button className="mt-6 w-full bg-primary text-on-primary py-4 rounded font-label-md text-label-md uppercase tracking-widest ambient-shadow hover:bg-primary-container transition-colors disabled:opacity-60" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Procesando..." : "Pagar pedido"}
                </button>
              </div>
            </aside>
          </form>
        ) : (
          <section className="lumen-card p-8 md:p-12 text-center max-w-2xl mx-auto">
            <Icon name="shopping_bag" className="text-5xl text-primary mb-4" />
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">No hay productos para pagar</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">Agregá productos al carrito para continuar con la compra.</p>
            <Link className="inline-flex bg-primary text-on-primary px-6 py-3 rounded font-label-md text-label-md uppercase tracking-widest hover:bg-primary-container transition-colors" href="/categorias/camisas">Ver categorías</Link>
          </section>
        )}
      </main>
    </div>
  );
}

function TextField({ className = "", error, label, type = "text", value, onChange }: { className?: string; error?: string; label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-on-surface-variant">{label}</span>
      <input className="lumen-input w-full rounded px-4 py-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} />
      {error ? <span className="mt-2 block text-error text-body-md">{error}</span> : null}
    </label>
  );
}

function PaymentOption({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 rounded border p-4 transition-colors ${checked ? "border-primary bg-primary-fixed/40" : "border-outline-variant/40 bg-surface-container-lowest"}`}>
      <input checked={checked} className="h-4 w-4 accent-primary" name="paymentMethod" type="radio" onChange={onChange} />
      <span className="text-on-surface">{label}</span>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-on-surface-variant"><span>{label}</span><span>{value}</span></div>;
}
