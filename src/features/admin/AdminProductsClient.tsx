"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AdminCard, AdminField, AdminModal, AdminPageHeader, adminInputClass } from "@/components/admin/AdminPrimitives";
import { Toast, useTimedToast } from "@/components/ui/Toast";
import { catalogCategories } from "@/features/catalog/categories";
import { getProductPricing } from "@/features/catalog/pricing";
import type { Product, ProductStatus } from "@/features/catalog/product.types";
import type { Discount, DiscountStatus, DiscountType } from "@/features/discounts/discount.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

type ProductDraft = Omit<Product, "images" | "colors" | "sizes"> & {
  images: string;
  colors: string;
  sizes: string;
  compareAtPrice?: number;
};

type DiscountDraft = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  status: DiscountStatus;
};

const emptyProduct: ProductDraft = {
  id: "",
  slug: "",
  name: "",
  displayName: "",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  category: "Camisas",
  material: "",
  colors: "",
  sizes: "",
  stock: 0,
  status: "active",
  images: "",
  image: "",
  color: "",
  createdAt: "",
  updatedAt: "",
};

const emptyDiscount: DiscountDraft = {
  id: "",
  code: "",
  type: "percentage",
  value: 10,
  status: "active",
};

export function AdminProductsClient() {
  const repositories = useBrowserRepositories();
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProduct);
  const [discountDraft, setDiscountDraft] = useState<DiscountDraft>(emptyDiscount);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
  const { message, tone, showToast } = useTimedToast();
  const shouldReduceMotion = useReducedMotion();

  const load = useCallback(async () => {
    if (!repositories) return;

    const [nextProducts, nextDiscounts] = await Promise.all([
      repositories.catalog.listProducts(),
      repositories.discounts.listDiscounts(),
    ]);

    setProducts(nextProducts);
    setDiscounts(nextDiscounts);
  }, [repositories]);

  useEffect(() => {
    load().catch(() => showToast("No pudimos cargar los datos.", "error"));
  }, [load, showToast]);

  const suggestionSource = useMemo(() => ({
    categories: Array.from(new Set([...catalogCategories.map((category) => category.label), ...products.map((product) => product.category)])).sort(),
    materials: Array.from(new Set(products.map((product) => product.material).filter(Boolean))).sort(),
    colors: Array.from(new Set(products.flatMap((product) => product.colors).filter(Boolean))).sort(),
    sizes: Array.from(new Set(products.flatMap((product) => product.sizes).filter(Boolean))).sort(),
  }), [products]);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repositories) return;

    const price = Number(productDraft.price);
    const normalizedCompareAtPrice = normalizeCompareAtPrice(productDraft.compareAtPrice, price);
    const now = new Date().toISOString();
    const colors = splitValues(productDraft.colors);
    const sizes = splitValues(productDraft.sizes);
    const parsedImages = parseProductImages(productDraft.images, productDraft.displayName || productDraft.name);
    const id = productDraft.id || `product-${Date.now()}`;

    const product: Product = {
      ...productDraft,
      id,
      slug: productDraft.slug || slugify(productDraft.displayName || productDraft.name),
      name: productDraft.name || productDraft.displayName,
      displayName: productDraft.displayName || productDraft.name,
      price,
      compareAtPrice: normalizedCompareAtPrice,
      stock: Number(productDraft.stock),
      colors,
      sizes,
      color: colors[0] ?? "",
      images: parsedImages,
      image: parsedImages[0]?.url ?? productDraft.image,
      createdAt: productDraft.createdAt || now,
      updatedAt: now,
    };

    await repositories.catalog.saveProduct(product);
    setProductDraft(emptyProduct);
    setProductModalOpen(false);
    showToast(normalizedCompareAtPrice ? "Producto guardado y publicado en ofertas." : "Producto guardado.");
    await load();
  }

  function editProduct(product: Product) {
    setProductDraft({
      ...product,
      compareAtPrice: product.compareAtPrice,
      images: product.images.map((image) => image.color ? `${image.color} | ${image.url}` : image.url).join("\n"),
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
    });
    setProductModalOpen(true);
  }

  async function deleteProduct() {
    if (!repositories || !productToDelete) return;

    await repositories.catalog.deleteProduct(productToDelete.id);
    setProductToDelete(null);
    showToast("Producto eliminado.");
    await load();
  }

  async function saveDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repositories) return;

    const now = new Date().toISOString();
    const existing = discounts.find((discount) => discount.id === discountDraft.id);

    await repositories.discounts.saveDiscount({
      ...discountDraft,
      id: discountDraft.id || `discount-${Date.now()}`,
      code: discountDraft.code.toUpperCase(),
      value: Number(discountDraft.value),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });

    setDiscountDraft(emptyDiscount);
    setDiscountModalOpen(false);
    showToast("Descuento guardado.");
    await load();
  }

  async function deleteDiscount() {
    if (!repositories || !discountToDelete) return;

    await repositories.discounts.deleteDiscount(discountToDelete.id);
    setDiscountToDelete(null);
    showToast("Descuento eliminado.");
    await load();
  }

  async function copyDiscountCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      showToast(`Código ${code} copiado.`);
    } catch {
      showToast("No pudimos copiar el código.", "error");
    }
  }

  return (
    <>
      <Toast message={message} tone={tone} />

      <AdminPageHeader title="Productos" description="Gestiona productos, precios promocionales y descuentos persistidos en la base local del navegador." />

      <div className="grid gap-6">
        <AdminCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm">Listado</h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">Si el precio anterior es mayor que el precio actual, el producto se publica automáticamente en <strong className="text-on-surface">/ofertas</strong>.</p>
            </div>

            <button className="rounded bg-primary px-4 py-2 text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" type="button" onClick={() => { setProductDraft(emptyProduct); setProductModalOpen(true); }}>
              Crear producto
            </button>
          </div>

          <div className="grid gap-4 lg:hidden">
            {products.map((product) => {
              const pricing = getProductPricing(product);

              return (
                <motion.article key={product.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4" whileHover={shouldReduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                  <div className="flex items-start gap-3">
                    <img alt={product.displayName} className="h-16 w-16 rounded-xl bg-surface-container object-cover" src={product.image} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-on-surface">{product.displayName}</p>
                          <p className="truncate text-body-sm text-on-surface-variant">/{product.slug}</p>
                        </div>

                        {pricing.hasDiscount ? <span className="rounded-full bg-primary-container px-2 py-1 text-[11px] text-on-primary-container">En oferta</span> : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="text-on-surface">{formatMoney(pricing.currentPrice)}</span>
                        {pricing.hasDiscount ? <span className="line-through">{formatMoney(pricing.originalPrice)}</span> : null}
                        <span>·</span>
                        <span>{product.stock} en inventario</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="text-primary transition-colors duration-200 hover:text-primary-container" type="button" onClick={() => editProduct(product)}>Editar</button>
                    <button className="text-error transition-colors duration-200 hover:opacity-80" type="button" onClick={() => setProductToDelete(product)}>Eliminar</button>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-on-surface-variant">
                <tr>
                  <th className="py-2">Producto</th>
                  <th>Precio actual</th>
                  <th>Oferta</th>
                  <th>Inventario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const pricing = getProductPricing(product);

                  return (
                    <tr key={product.id} className="border-t border-outline-variant/20">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img alt={product.displayName} className="h-12 w-12 rounded-lg bg-surface-container object-cover" src={product.image} />
                          <div>
                            <p className="font-medium text-on-surface">{product.displayName}</p>
                            <p className="text-body-sm text-on-surface-variant">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-on-surface">{formatMoney(pricing.currentPrice)}</td>
                      <td className="py-3">
                        {pricing.hasDiscount ? (
                          <div>
                            <p className="text-on-surface line-through">{formatMoney(pricing.originalPrice)}</p>
                            <p className="text-body-sm text-primary">-{pricing.discountPercentage}% · {formatMoney(pricing.discountAmount)}</p>
                          </div>
                        ) : (
                          <span className="text-on-surface-variant">Sin oferta</span>
                        )}
                      </td>
                      <td className="py-3 text-on-surface">{product.stock}</td>
                      <td className="py-3 text-on-surface">{product.status === "active" ? "Activo" : "Borrador"}</td>
                      <td className="py-3">
                        <div className="flex gap-4">
                          <button className="text-primary transition-colors duration-200 hover:text-primary-container" type="button" onClick={() => editProduct(product)}>Editar</button>
                          <button className="text-error transition-colors duration-200 hover:opacity-80" type="button" onClick={() => setProductToDelete(product)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm">Descuentos</h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">Los clientes aplican estos códigos en la pantalla de finalizar compra.</p>
            </div>

            <button className="rounded bg-primary px-4 py-2 text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" type="button" onClick={() => { setDiscountDraft(emptyDiscount); setDiscountModalOpen(true); }}>
              Crear descuento
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {discounts.map((discount) => (
              <motion.div key={discount.id} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4" whileHover={shouldReduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                <div>
                  <p className="font-headline-sm text-headline-sm">{discount.code}</p>
                  <p className="text-sm text-on-surface-variant">{discount.type === "percentage" ? `${discount.value}%` : formatMoney(discount.value)} · {discount.status === "active" ? "Activo" : "Inactivo"}</p>
                  <p className="mt-2 text-body-sm text-on-surface-variant">Disponible en <strong className="text-on-surface">Finalizar compra</strong>.</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="text-on-surface-variant transition-colors duration-200 hover:text-on-surface" type="button" onClick={() => copyDiscountCode(discount.code)}>Copiar código</button>
                  <button className="mr-3 text-primary transition-colors duration-200 hover:text-primary-container" type="button" onClick={() => { setDiscountDraft(discount); setDiscountModalOpen(true); }}>Editar</button>
                  <button className="text-error transition-colors duration-200 hover:opacity-80" type="button" onClick={() => setDiscountToDelete(discount)}>Eliminar</button>
                </div>
              </motion.div>
            ))}

            {discounts.length === 0 ? <p className="text-on-surface-variant">Todavía no hay descuentos cargados.</p> : null}
          </div>
        </AdminCard>
      </div>

      <AnimatePresence>
        {productModalOpen ? (
          <AdminModal title={productDraft.id ? "Editar producto" : "Crear producto"} onClose={() => setProductModalOpen(false)}>
            <form className="space-y-4" onSubmit={saveProduct}>
              <ProductFields draft={productDraft} setDraft={setProductDraft} suggestionSource={suggestionSource} />
              <button className="w-full rounded bg-primary px-4 py-3 text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" type="submit">Guardar producto</button>
            </form>
          </AdminModal>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {productToDelete ? (
          <AdminModal title="Eliminar producto" onClose={() => setProductToDelete(null)}>
            <div className="space-y-4">
              <p className="text-on-surface-variant">Eliminar <strong className="text-on-surface">{productToDelete.displayName}</strong> quitará el producto del inventario y eliminará todos sus datos asociados.</p>
              <p className="rounded-lg bg-error-container px-4 py-3 text-on-error-container">Si solo quieres ocultarlo de la tienda, recomendamos desactivarlo cambiando su estado a borrador.</p>
              <div className="flex justify-end gap-3">
                <button className="rounded border border-outline-variant px-4 py-2 transition-colors duration-200 hover:bg-surface-variant" type="button" onClick={() => setProductToDelete(null)}>Cancelar</button>
                <button className="rounded bg-error px-4 py-2 text-on-error transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:scale-[0.99]" type="button" onClick={deleteProduct}>Eliminar definitivamente</button>
              </div>
            </div>
          </AdminModal>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {discountModalOpen ? (
          <AdminModal title={discountDraft.id ? "Editar descuento" : "Crear descuento"} onClose={() => setDiscountModalOpen(false)}>
            <form className="space-y-4" onSubmit={saveDiscount}>
              <AdminField label="Código"><input className={adminInputClass} value={discountDraft.code} onChange={(e) => setDiscountDraft({ ...discountDraft, code: e.target.value })} placeholder="Ejemplo: LUMEN10" required /></AdminField>
              <AdminField label="Tipo"><select className={adminInputClass} value={discountDraft.type} onChange={(e) => setDiscountDraft({ ...discountDraft, type: e.target.value as DiscountType })}><option value="percentage">Porcentaje</option><option value="fixed">Monto fijo</option></select></AdminField>
              <AdminField label="Valor"><input className={adminInputClass} min="0" type="number" value={discountDraft.value} onChange={(e) => setDiscountDraft({ ...discountDraft, value: Number(e.target.value) })} placeholder="10" /></AdminField>
              <AdminField label="Estado"><select className={adminInputClass} value={discountDraft.status} onChange={(e) => setDiscountDraft({ ...discountDraft, status: e.target.value as DiscountStatus })}><option value="active">Activo</option><option value="draft">Inactivo</option></select></AdminField>
              <button className="w-full rounded bg-primary px-4 py-3 text-on-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-container active:translate-y-0 active:scale-[0.99]" type="submit">Guardar descuento</button>
            </form>
          </AdminModal>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {discountToDelete ? (
          <AdminModal title="Eliminar descuento" onClose={() => setDiscountToDelete(null)}>
            <div className="space-y-4">
              <p className="text-on-surface-variant">Se eliminará el descuento <strong className="text-on-surface">{discountToDelete.code}</strong>. Esta acción quitará sus datos asociados de la base local.</p>
              <div className="flex justify-end gap-3">
                <button className="rounded border border-outline-variant px-4 py-2 transition-colors duration-200 hover:bg-surface-variant" type="button" onClick={() => setDiscountToDelete(null)}>Cancelar</button>
                <button className="rounded bg-error px-4 py-2 text-on-error transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:scale-[0.99]" type="button" onClick={deleteDiscount}>Eliminar descuento</button>
              </div>
            </div>
          </AdminModal>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ProductFields({
  draft,
  setDraft,
  suggestionSource,
}: {
  draft: ProductDraft;
  setDraft: (draft: ProductDraft) => void;
  suggestionSource: { categories: string[]; materials: string[]; colors: string[]; sizes: string[] };
}) {
  const update = (field: keyof ProductDraft, value: string | number | ProductStatus | undefined) => setDraft({ ...draft, [field]: value });
  const saleIsActive = typeof draft.compareAtPrice === "number" && draft.compareAtPrice > Number(draft.price);

  return (
    <>
      <AdminField label="Nombre"><input className={adminInputClass} value={draft.displayName} onChange={(e) => update("displayName", e.target.value)} placeholder="Ejemplo: Camisa de lino clásica" required /></AdminField>
      <AdminField label="Slug"><input className={adminInputClass} value={draft.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Se genera automáticamente si lo dejas vacío" /></AdminField>
      <AdminField label="Descripción"><textarea className={adminInputClass} rows={3} value={draft.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe el producto y sus principales características" /></AdminField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Precio actual"><input className={adminInputClass} min="0" type="number" value={draft.price} onChange={(e) => update("price", Number(e.target.value))} placeholder="140" /></AdminField>
        <AdminField label="Precio anterior (opcional)"><input className={adminInputClass} min="0" type="number" value={draft.compareAtPrice ?? ""} onChange={(e) => update("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)} placeholder="170" /></AdminField>
      </div>

      <p className="-mt-2 text-body-sm text-on-surface-variant">{saleIsActive ? `Se mostrará en oferta con un descuento visible de ${formatMoney((draft.compareAtPrice ?? 0) - Number(draft.price))}.` : "Si el precio anterior es mayor que el precio actual, la prenda se publica en ofertas y muestra ambos precios en la tienda."}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Inventario"><input className={adminInputClass} min="0" type="number" value={draft.stock} onChange={(e) => update("stock", Number(e.target.value))} placeholder="24" /></AdminField>
        <AdminField label="Tipo de producto"><select className={adminInputClass} value={draft.category} onChange={(e) => update("category", e.target.value)}>{suggestionSource.categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></AdminField>
      </div>

      <SuggestionInput label="Material" value={draft.material} onChange={(value) => update("material", value)} placeholder="Lino europeo" suggestions={suggestionSource.materials} />
      <SuggestionInput label="Colores" value={draft.colors} onChange={(value) => update("colors", value)} placeholder="Arena, Blanco roto" suggestions={suggestionSource.colors} multiValue helperText="Escribe colores separados por coma. Las sugerencias reutilizan valores guardados." />
      <SuggestionInput label="Tallas" value={draft.sizes} onChange={(value) => update("sizes", value)} placeholder="S, M, L" suggestions={suggestionSource.sizes} multiValue helperText="Usa comas para agregar varias tallas y reduce errores con las sugerencias." />
      <AdminField label="Imágenes por color o generales"><textarea className={adminInputClass} rows={5} value={draft.images} onChange={(e) => update("images", e.target.value)} placeholder={"Azul | https://.../camisa-azul.jpg\nBeige | https://.../camisa-beige.jpg\nhttps://.../detalle-general.jpg"} required /></AdminField>
      <p className="-mt-2 text-body-sm text-on-surface-variant">Usa el formato <strong className="text-on-surface">Color | URL</strong> para que la vista previa cambie al seleccionar un color. Si dejas solo la URL, la imagen será general.</p>
      <AdminField label="Estado"><select className={adminInputClass} value={draft.status} onChange={(e) => update("status", e.target.value as ProductStatus)}><option value="active">Activo</option><option value="draft">Borrador</option></select></AdminField>
    </>
  );
}

function normalizeCompareAtPrice(compareAtPrice: number | undefined, price: number) {
  if (typeof compareAtPrice !== "number" || Number.isNaN(compareAtPrice) || compareAtPrice <= price) return undefined;
  return compareAtPrice;
}

function splitValues(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseProductImages(value: string, alt: string) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean).map((item, index) => {
    const [maybeColor, maybeUrl] = item.split("|").map((part) => part.trim());
    if (maybeUrl) return { url: maybeUrl, alt, position: index, color: maybeColor };
    return { url: maybeColor, alt, position: index };
  });
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SuggestionInput({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
  helperText,
  multiValue = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  helperText?: string;
  multiValue?: boolean;
}) {
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = multiValue ? getLastToken(value) : value.trim();

      if (!token) {
        setVisibleSuggestions([]);
        return;
      }

      const usedValues = multiValue ? new Set(splitValues(value).map((item) => item.toLowerCase())) : new Set<string>();
      setVisibleSuggestions(
        suggestions
          .filter((suggestion) => suggestion.toLowerCase().includes(token.toLowerCase()))
          .filter((suggestion) => !usedValues.has(suggestion.toLowerCase()) || suggestion.toLowerCase() === token.toLowerCase())
          .slice(0, 6),
      );
    }, 220);

    return () => window.clearTimeout(timer);
  }, [multiValue, suggestions, value]);

  function selectSuggestion(suggestion: string) {
    if (!multiValue) {
      onChange(suggestion);
      setVisibleSuggestions([]);
      return;
    }

    const currentValues = splitValues(value);
    currentValues.splice(Math.max(currentValues.length - 1, 0), currentValues.length > 0 ? 1 : 0, suggestion);
    onChange(`${currentValues.join(", ")}${value.endsWith(",") ? "," : ""}`);
    setVisibleSuggestions([]);
  }

  return (
    <AdminField label={label}>
      <div className="relative">
        <input className={adminInputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        {visibleSuggestions.length > 0 ? <div className="absolute z-10 mt-2 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-2 shadow-lg"><div className="flex flex-wrap gap-2">{visibleSuggestions.map((suggestion) => <button key={suggestion} className="rounded-full border border-outline-variant/30 px-3 py-1 text-body-sm text-on-surface transition-colors duration-200 hover:border-primary hover:text-primary" type="button" onClick={() => selectSuggestion(suggestion)}>{suggestion}</button>)}</div></div> : null}
      </div>
      {helperText ? <p className="mt-2 text-body-sm text-on-surface-variant">{helperText}</p> : null}
    </AdminField>
  );
}

function getLastToken(value: string) {
  const tokens = value.split(",");
  return tokens[tokens.length - 1]?.trim() ?? "";
}
