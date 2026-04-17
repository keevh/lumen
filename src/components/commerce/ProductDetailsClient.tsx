"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/features/catalog/product.types";
import { formatMoney } from "@/lib/format";
import { createBrowserRepositories } from "@/shared/storage/repositories";

const colorLabels: Record<string, string> = {
  Beige: "Beige",
  Oat: "Avena",
  "Off-White": "Blanco roto",
  Sage: "Salvia",
  Sand: "Arena",
};

export function ProductDetailsClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [selectedColor, setSelectedColor] = useState(product.colors.length === 1 ? product.colors[0] : "");
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"neutral" | "error">("neutral");
  const [isAdding, setIsAdding] = useState(false);

  async function addToCart() {
    if (product.sizes.length > 0 && !selectedSize) {
      setStatusTone("error");
      setStatus("Selecciona una talla antes de agregar el producto al carrito.");
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      setStatusTone("error");
      setStatus("Selecciona un color antes de agregar el producto al carrito.");
      return;
    }

    setIsAdding(true);
    setStatus("");
    setStatusTone("neutral");

    try {
      const repositories = createBrowserRepositories();
      await repositories.cart.addItem({
        productId: product.id,
        slug: product.slug,
        name: product.displayName,
        variant: [selectedColor ? colorLabels[selectedColor] ?? selectedColor : null, selectedSize].filter(Boolean).join(" / ") || "Única variante",
        unitPrice: product.price,
        image: product.image,
        quantity: 1,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      });
      setStatusTone("neutral");
      setStatus("Producto agregado al carrito.");
    } catch {
      setStatusTone("error");
      setStatus("No pudimos agregar el producto. Intenta nuevamente.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="md:col-span-5 md:pl-gutter flex flex-col justify-center">
      <nav className="text-label-sm font-label-sm text-on-surface-variant mb-stack-lg uppercase tracking-widest"><Link className="hover:text-primary transition-colors" href="/categorias">Categorías</Link> / <span className="text-on-surface">{product.category}</span></nav>
      <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-[64px] text-on-surface mb-stack-sm tracking-tighter">{product.displayName}</h1>
      <p className="font-body-lg text-body-lg text-secondary mb-stack-lg">{formatMoney(product.price)}</p>
      <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">{product.description}</p>
      <hr className="border-t border-surface-variant mb-stack-lg" />
      {product.sizes.length > 0 ? <div className="mb-stack-lg"><div className="flex justify-between items-center mb-stack-sm"><span className="font-label-md text-label-md uppercase tracking-widest text-on-surface">Talla</span><span className="font-label-sm text-label-sm text-outline">Guía de tallas</span></div><div className="flex flex-wrap gap-stack-sm">{product.sizes.map((size) => <button key={size} className={`w-12 h-12 flex items-center justify-center rounded font-label-md text-label-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${selectedSize === size ? "bg-primary text-on-primary ambient-shadow" : "ghost-outline text-on-surface-variant hover:border-primary hover:text-primary"}`} type="button" onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div> : null}
      {product.colors.length > 0 ? <div className="mb-stack-lg"><span className="block font-label-md text-label-md uppercase tracking-widest text-on-surface mb-stack-sm">Color</span><div className="flex flex-wrap gap-stack-sm">{product.colors.map((color) => <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded border font-label-sm text-label-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${selectedColor === color ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`}>{colorLabels[color] ?? color}</button>)}</div></div> : null}
      <button className="mb-stack-md flex w-full items-center justify-center gap-2 rounded bg-primary py-4 font-label-md text-label-md uppercase tracking-widest text-on-primary ambient-shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99] disabled:opacity-60" type="button" onClick={addToCart} disabled={isAdding || product.stock <= 0}><Icon name="shopping_bag" />{product.stock > 0 ? isAdding ? "Agregando..." : "Agregar al carrito" : "Sin existencias"}</button>
      {status ? <p className={`rounded-lg px-4 py-3 font-body-sm text-body-sm ${statusTone === "error" ? "bg-error-container text-on-error-container" : "text-on-surface-variant"}`} role={statusTone === "error" ? "alert" : "status"}>{status}</p> : null}
      <div className="mt-stack-lg space-y-stack-sm text-on-surface-variant font-body-sm text-body-sm"><p><strong className="text-on-surface">Material:</strong> {product.material}</p><p><strong className="text-on-surface">Existencias:</strong> {product.stock > 0 ? "Disponible" : "Sin existencias"}</p></div>
    </div>
  );
}
