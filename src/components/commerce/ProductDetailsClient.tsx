"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Toast, useTimedToast } from "@/components/ui/Toast";
import { getProductPricing } from "@/features/catalog/pricing";
import type { Product } from "@/features/catalog/product.types";
import { getPrimaryImageForColor } from "@/features/catalog/product-images";
import { formatMoney } from "@/lib/format";
import { createBrowserRepositories } from "@/shared/storage/repositories";

const colorLabels: Record<string, string> = {
  Beige: "Beige",
  Oat: "Avena",
  "Off-White": "Blanco roto",
  Sage: "Salvia",
  Sand: "Arena",
};

export function ProductDetailsClient({ product, selectedColor, onColorChange }: { product: Product; selectedColor?: string; onColorChange?: (color: string) => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [internalSelectedColor, setInternalSelectedColor] = useState(product.colors.length === 1 ? product.colors[0] : "");
  const [validationMessage, setValidationMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addFeedbackKey, setAddFeedbackKey] = useState(0);
  const activeColor = selectedColor ?? internalSelectedColor;
  const selectedPreviewImage = useMemo(() => getPrimaryImageForColor(product.images, activeColor), [product.images, activeColor]);
  const pricing = useMemo(() => getProductPricing(product), [product]);
  const { message, tone, showToast } = useTimedToast();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setInternalSelectedColor(product.colors.length === 1 ? product.colors[0] : "");
    setValidationMessage("");
  }, [product]);

  function selectColor(color: string) {
    setValidationMessage("");
    setInternalSelectedColor(color);
    onColorChange?.(color);
  }

  function selectSize(size: string) {
    setValidationMessage("");
    setSelectedSize(size);
  }

  async function addToCart() {
    if (product.sizes.length > 0 && !selectedSize) {
      setValidationMessage("Selecciona una talla antes de agregar el producto al carrito.");
      return;
    }

    if (product.colors.length > 0 && !activeColor) {
      setValidationMessage("Selecciona un color antes de agregar el producto al carrito.");
      return;
    }

    setIsAdding(true);
    setValidationMessage("");

    try {
      const repositories = createBrowserRepositories();
      await repositories.cart.addItem({
        productId: product.id,
        slug: product.slug,
        name: product.displayName,
        variant: [activeColor ? colorLabels[activeColor] ?? activeColor : null, selectedSize].filter(Boolean).join(" / ") || "Única variante",
        unitPrice: pricing.currentPrice,
        image: selectedPreviewImage?.url ?? product.image,
        quantity: 1,
        color: activeColor || undefined,
        size: selectedSize || undefined,
      });
      setAddFeedbackKey((current) => current + 1);
      showToast("Producto agregado al carrito.");
    } catch {
      showToast("No pudimos agregar el producto. Intenta nuevamente.", "error");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="md:col-span-5 md:pl-gutter flex flex-col justify-center">
      <Toast message={message} tone={tone} />
      <nav className="text-label-sm font-label-sm text-on-surface-variant mb-stack-lg uppercase tracking-widest"><Link className="hover:text-primary transition-colors" href="/categorias">Categorías</Link> / <span className="text-on-surface">{product.category}</span></nav>
      <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-[64px] text-on-surface mb-stack-sm tracking-tighter">{product.displayName}</h1>
      <div className="mb-stack-lg flex flex-wrap items-end gap-3"><p className="font-body-lg text-body-lg text-secondary">{formatMoney(pricing.currentPrice)}</p>{pricing.hasDiscount ? <><p className="font-body-md text-body-md text-on-surface-variant line-through">{formatMoney(pricing.originalPrice)}</p><span className="rounded-full bg-primary-container px-3 py-1 text-label-sm text-on-primary-container">Ahorra {formatMoney(pricing.discountAmount)}</span></> : null}</div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">{product.description}</p>
      <hr className="border-t border-surface-variant mb-stack-lg" />
      {product.sizes.length > 0 ? <div className="mb-stack-lg"><div className="mb-stack-sm flex items-center justify-between"><span className="font-label-md text-label-md uppercase tracking-widest text-on-surface">Talla</span><span className="font-label-sm text-label-sm text-outline">Guía de tallas</span></div><div className="flex flex-wrap gap-stack-sm">{product.sizes.map((size) => <motion.button key={size} className={`flex h-12 w-12 items-center justify-center rounded font-label-md text-label-md ${selectedSize === size ? "bg-primary text-on-primary ambient-shadow" : "ghost-outline text-on-surface-variant hover:border-primary hover:text-primary"}`} type="button" onClick={() => selectSize(size)} whileHover={shouldReduceMotion ? undefined : { y: -2 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }} transition={{ duration: 0.18, ease: "easeOut" }}>{size}</motion.button>)}</div></div> : null}
      {product.colors.length > 0 ? <div className="mb-stack-lg"><div className="mb-stack-sm flex flex-wrap items-center justify-between gap-2"><span className="block font-label-md text-label-md uppercase tracking-widest text-on-surface">Colores disponibles</span>{activeColor ? <span className="text-body-sm text-on-surface-variant">Seleccionado: {colorLabels[activeColor] ?? activeColor}</span> : null}</div><div className="flex flex-wrap gap-stack-sm">{product.colors.map((color) => <motion.button key={color} type="button" onClick={() => selectColor(color)} className={`rounded-full border px-4 py-2 font-label-sm text-label-sm ${activeColor === color ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`} whileHover={shouldReduceMotion ? undefined : { y: -2 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.18, ease: "easeOut" }}>{colorLabels[color] ?? color}</motion.button>)}</div>{selectedPreviewImage?.color ? <p className="mt-3 text-body-sm text-on-surface-variant">La vista previa cambia según el color cuando hay imágenes específicas disponibles.</p> : null}</div> : null}
      <motion.button className="mb-stack-md flex w-full items-center justify-center gap-2 rounded bg-primary py-4 font-label-md text-label-md uppercase tracking-widest text-on-primary ambient-shadow disabled:opacity-60" type="button" onClick={addToCart} disabled={isAdding || product.stock <= 0} whileHover={shouldReduceMotion ? undefined : { y: -3 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }} animate={shouldReduceMotion || addFeedbackKey === 0 ? undefined : { scale: [1, 0.98, 1.03, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 0 rgba(0,0,0,0)", "0 12px 28px rgba(85, 98, 87, 0.28)", "0 0 0 rgba(0,0,0,0)"] }} transition={{ duration: 0.32, ease: "easeOut" }}><motion.span key={`add-to-cart-${addFeedbackKey}`} className="inline-flex items-center gap-2" animate={shouldReduceMotion || addFeedbackKey === 0 ? undefined : { y: [0, -1, 0] }} transition={{ duration: 0.24, ease: "easeOut" }}><Icon name="shopping_bag" />{product.stock > 0 ? isAdding ? "Agregando..." : "Agregar al carrito" : "Sin existencias"}</motion.span></motion.button>
      {validationMessage ? <p className="rounded-lg bg-error-container px-4 py-3 font-body-sm text-body-sm text-on-error-container" role="alert">{validationMessage}</p> : null}
      <div className="mt-stack-lg space-y-stack-sm text-on-surface-variant font-body-sm text-body-sm"><p><strong className="text-on-surface">Material:</strong> {product.material}</p><p><strong className="text-on-surface">Existencias:</strong> {product.stock > 0 ? "Disponible" : "Sin existencias"}</p></div>
    </div>
  );
}
