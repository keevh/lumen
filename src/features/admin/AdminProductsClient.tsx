"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminCard, AdminField, AdminModal, AdminPageHeader, adminInputClass } from "@/components/admin/AdminPrimitives";
import type { Product, ProductStatus } from "@/features/catalog/product.types";
import type { Discount, DiscountStatus, DiscountType } from "@/features/discounts/discount.types";
import { formatMoney } from "@/lib/format";
import { useBrowserRepositories } from "@/shared/storage/useBrowserRepositories";

type ProductDraft = Omit<Product, "images" | "colors" | "sizes"> & { images: string; colors: string; sizes: string };
type DiscountDraft = { id: string; code: string; type: DiscountType; value: number; status: DiscountStatus };

const emptyProduct: ProductDraft = { id: "", slug: "", name: "", displayName: "", description: "", price: 0, category: "Linen", material: "", colors: "", sizes: "", stock: 0, status: "active", images: "", image: "", color: "", createdAt: "", updatedAt: "" };
const emptyDiscount: DiscountDraft = { id: "", code: "", type: "percentage", value: 10, status: "active" };

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
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!repositories) return;
    const [nextProducts, nextDiscounts] = await Promise.all([repositories.catalog.listProducts(), repositories.discounts.listDiscounts()]);
    setProducts(nextProducts);
    setDiscounts(nextDiscounts);
  }, [repositories]);

  useEffect(() => { load().catch(() => setMessage("No pudimos cargar los datos.")); }, [load]);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repositories) return;
    const now = new Date().toISOString();
    const colors = splitValues(productDraft.colors);
    const sizes = splitValues(productDraft.sizes);
    const imageUrls = splitValues(productDraft.images);
    const id = productDraft.id || `product-${Date.now()}`;
    const product: Product = {
      ...productDraft,
      id,
      slug: productDraft.slug || slugify(productDraft.displayName || productDraft.name),
      name: productDraft.name || productDraft.displayName,
      displayName: productDraft.displayName || productDraft.name,
      price: Number(productDraft.price),
      stock: Number(productDraft.stock),
      colors,
      sizes,
      color: colors[0] ?? "",
      images: imageUrls.map((url, index) => ({ url, alt: productDraft.displayName || productDraft.name, position: index })),
      image: imageUrls[0] ?? productDraft.image,
      createdAt: productDraft.createdAt || now,
      updatedAt: now,
    };
    await repositories.catalog.saveProduct(product);
    setProductDraft(emptyProduct);
    setProductModalOpen(false);
    setMessage("Producto guardado.");
    await load();
  }

  function editProduct(product: Product) {
    setProductDraft({ ...product, images: product.images.map((image) => image.url).join(", "), colors: product.colors.join(", "), sizes: product.sizes.join(", ") });
    setProductModalOpen(true);
  }

  async function deleteProduct() {
    if (!repositories) return;
    if (!productToDelete) return;
    await repositories.catalog.deleteProduct(productToDelete.id);
    setProductToDelete(null);
    setMessage("Producto eliminado.");
    await load();
  }

  async function saveDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repositories) return;
    const now = new Date().toISOString();
    const existing = discounts.find((discount) => discount.id === discountDraft.id);
    await repositories.discounts.saveDiscount({ ...discountDraft, id: discountDraft.id || `discount-${Date.now()}`, code: discountDraft.code.toUpperCase(), value: Number(discountDraft.value), createdAt: existing?.createdAt ?? now, updatedAt: now });
    setDiscountDraft(emptyDiscount);
    setDiscountModalOpen(false);
    setMessage("Descuento guardado.");
    await load();
  }

  async function deleteDiscount() {
    if (!repositories) return;
    if (!discountToDelete) return;
    await repositories.discounts.deleteDiscount(discountToDelete.id);
    setDiscountToDelete(null);
    setMessage("Descuento eliminado.");
    await load();
  }

  return (
    <>
      <AdminPageHeader title="Productos" description="Gestiona productos y descuentos persistidos en la base local del navegador." />
      {message ? <p className="mb-4 rounded-lg bg-primary-container px-4 py-3 text-on-primary-container" role="status">{message}</p> : null}
      <div className="grid gap-6">
        <AdminCard className="overflow-x-auto"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-headline-sm text-headline-sm">Listado</h2><button className="rounded bg-primary px-4 py-2 text-on-primary" type="button" onClick={() => { setProductDraft(emptyProduct); setProductModalOpen(true); }}>Crear producto</button></div><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-on-surface-variant"><tr><th className="py-2">Producto</th><th>Precio</th><th>Inventario</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-outline-variant/20"><td className="py-3"><div className="flex items-center gap-3"><img alt={product.displayName} className="h-12 w-12 rounded object-cover bg-surface-container" src={product.image} /><div><p className="font-medium">{product.displayName}</p><p className="text-on-surface-variant">/{product.slug}</p></div></div></td><td>{formatMoney(product.price)}</td><td>{product.stock}</td><td>{product.status === "active" ? "Activo" : "Borrador"}</td><td><button className="mr-3 text-primary" type="button" onClick={() => editProduct(product)}>Editar</button><button className="text-error" type="button" onClick={() => setProductToDelete(product)}>Eliminar</button></td></tr>)}</tbody></table></AdminCard>
      </div>
      <div className="mt-8 grid gap-6">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-headline-sm text-headline-sm">Descuentos</h2><button className="rounded bg-primary px-4 py-2 text-on-primary" type="button" onClick={() => { setDiscountDraft(emptyDiscount); setDiscountModalOpen(true); }}>Crear descuento</button></div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {discounts.map((discount) => (
              <div key={discount.id} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
                <div>
                  <p className="font-headline-sm text-headline-sm">{discount.code}</p>
                  <p className="text-sm text-on-surface-variant">{discount.type === "percentage" ? `${discount.value}%` : formatMoney(discount.value)} · {discount.status === "active" ? "Activo" : "Inactivo"}</p>
                </div>
                <div className="mt-4">
                  <button className="mr-3 text-primary" type="button" onClick={() => { setDiscountDraft(discount); setDiscountModalOpen(true); }}>Editar</button>
                  <button className="text-error" type="button" onClick={() => setDiscountToDelete(discount)}>Eliminar</button>
                </div>
              </div>
            ))}
            {discounts.length === 0 ? <p className="text-on-surface-variant">Todavía no hay descuentos cargados.</p> : null}
          </div>
        </AdminCard>
      </div>
      {productModalOpen ? <AdminModal title={productDraft.id ? "Editar producto" : "Crear producto"} onClose={() => setProductModalOpen(false)}><form className="space-y-4" onSubmit={saveProduct}><ProductFields draft={productDraft} setDraft={setProductDraft} /><button className="w-full rounded bg-primary px-4 py-3 text-on-primary" type="submit">Guardar producto</button></form></AdminModal> : null}
      {productToDelete ? <AdminModal title="Eliminar producto" onClose={() => setProductToDelete(null)}><div className="space-y-4"><p className="text-on-surface-variant">Eliminar <strong className="text-on-surface">{productToDelete.displayName}</strong> quitará el producto del inventario y eliminará todos sus datos asociados.</p><p className="rounded-lg bg-error-container px-4 py-3 text-on-error-container">Si solo quieres ocultarlo de la tienda, recomendamos desactivarlo cambiando su estado a borrador.</p><div className="flex justify-end gap-3"><button className="rounded border border-outline-variant px-4 py-2" type="button" onClick={() => setProductToDelete(null)}>Cancelar</button><button className="rounded bg-error px-4 py-2 text-on-error" type="button" onClick={deleteProduct}>Eliminar definitivamente</button></div></div></AdminModal> : null}
      {discountModalOpen ? <AdminModal title={discountDraft.id ? "Editar descuento" : "Crear descuento"} onClose={() => setDiscountModalOpen(false)}>
          <form className="space-y-4" onSubmit={saveDiscount}>
            <AdminField label="Código"><input className={adminInputClass} value={discountDraft.code} onChange={(e) => setDiscountDraft({ ...discountDraft, code: e.target.value })} required /></AdminField>
            <AdminField label="Tipo"><select className={adminInputClass} value={discountDraft.type} onChange={(e) => setDiscountDraft({ ...discountDraft, type: e.target.value as DiscountType })}><option value="percentage">Porcentaje</option><option value="fixed">Monto fijo</option></select></AdminField>
            <AdminField label="Valor"><input className={adminInputClass} min="0" type="number" value={discountDraft.value} onChange={(e) => setDiscountDraft({ ...discountDraft, value: Number(e.target.value) })} /></AdminField>
            <AdminField label="Estado"><select className={adminInputClass} value={discountDraft.status} onChange={(e) => setDiscountDraft({ ...discountDraft, status: e.target.value as DiscountStatus })}><option value="active">Activo</option><option value="draft">Inactivo</option></select></AdminField>
            <button className="w-full rounded bg-primary px-4 py-3 text-on-primary" type="submit">Guardar descuento</button>
          </form>
        </AdminModal> : null}
      {discountToDelete ? <AdminModal title="Eliminar descuento" onClose={() => setDiscountToDelete(null)}><div className="space-y-4"><p className="text-on-surface-variant">Se eliminará el descuento <strong className="text-on-surface">{discountToDelete.code}</strong>. Esta acción quitará sus datos asociados de la base local.</p><div className="flex justify-end gap-3"><button className="rounded border border-outline-variant px-4 py-2" type="button" onClick={() => setDiscountToDelete(null)}>Cancelar</button><button className="rounded bg-error px-4 py-2 text-on-error" type="button" onClick={deleteDiscount}>Eliminar descuento</button></div></div></AdminModal> : null}
    </>
  );
}

function ProductFields({ draft, setDraft }: { draft: ProductDraft; setDraft: (draft: ProductDraft) => void }) {
  const update = (field: keyof ProductDraft, value: string | number | ProductStatus) => setDraft({ ...draft, [field]: value });
  return (
    <>
      <AdminField label="Nombre"><input className={adminInputClass} value={draft.displayName} onChange={(e) => update("displayName", e.target.value)} required /></AdminField>
      <AdminField label="Slug"><input className={adminInputClass} value={draft.slug} onChange={(e) => update("slug", e.target.value)} /></AdminField>
      <AdminField label="Descripción"><textarea className={adminInputClass} rows={3} value={draft.description} onChange={(e) => update("description", e.target.value)} /></AdminField>
      <div className="grid grid-cols-2 gap-4"><AdminField label="Precio"><input className={adminInputClass} min="0" type="number" value={draft.price} onChange={(e) => update("price", Number(e.target.value))} /></AdminField><AdminField label="Inventario"><input className={adminInputClass} min="0" type="number" value={draft.stock} onChange={(e) => update("stock", Number(e.target.value))} /></AdminField></div>
      <AdminField label="Categoría"><input className={adminInputClass} value={draft.category} onChange={(e) => update("category", e.target.value)} /></AdminField>
      <AdminField label="Material"><input className={adminInputClass} value={draft.material} onChange={(e) => update("material", e.target.value)} /></AdminField>
      <AdminField label="Colores (separados por coma)"><input className={adminInputClass} value={draft.colors} onChange={(e) => update("colors", e.target.value)} /></AdminField>
      <AdminField label="Talles (separados por coma)"><input className={adminInputClass} value={draft.sizes} onChange={(e) => update("sizes", e.target.value)} /></AdminField>
      <AdminField label="Imágenes como URLs (separadas por coma)"><textarea className={adminInputClass} rows={3} value={draft.images} onChange={(e) => update("images", e.target.value)} required /></AdminField>
      <AdminField label="Estado"><select className={adminInputClass} value={draft.status} onChange={(e) => update("status", e.target.value as ProductStatus)}><option value="active">Activo</option><option value="draft">Borrador</option></select></AdminField>
    </>
  );
}

function splitValues(value: string) { return value.split(",").map((item) => item.trim()).filter(Boolean); }
function slugify(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
