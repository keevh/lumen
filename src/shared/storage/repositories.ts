import type { Cart, CartItem, CartItemInput, CartRepository } from "@/features/cart/cart.types";
import type { CatalogRepository, Product, ProductFilters } from "@/features/catalog/product.types";
import type { Discount, DiscountsRepository } from "@/features/discounts/discount.types";
import type { Order, OrdersRepository } from "@/features/orders/order.types";
import type { SettingsRepository, StoreSettings } from "@/features/settings/settings.types";
import { getBrowserLocale } from "@/shared/browser-locale";
import type { CommerceRepositories } from "@/shared/storage/storage-port";
import {
  clearStore,
  defaultStoreSettings,
  deleteFromStore,
  getAllFromStore,
  getFromIndex,
  getFromStore,
  putInStore,
  STORE_NAMES,
} from "@/shared/storage/browser-db";
import { dispatchCartUpdatedEvent } from "@/shared/storage/cart-events";

function sortByUpdatedAtDesc<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function matchesProductFilters(product: Product, filters?: ProductFilters) {
  if (!filters) return true;
  if (filters.category && product.category !== filters.category) return false;
  if (filters.status && product.status !== filters.status) return false;
  return true;
}

async function calculateCart(items: CartItem[]): Promise<Cart> {
  const settings = (await getFromStore<StoreSettings>(STORE_NAMES.settings, defaultStoreSettings.id)) ?? defaultStoreSettings;
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * settings.taxRate * 100) / 100;

  return {
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    updatedAt: new Date().toISOString(),
  };
}

function createCartItem(input: CartItemInput): CartItem {
  return {
    ...input,
    id: `${input.productId}:${input.color ?? "default"}:${input.size ?? "default"}`,
    price: input.unitPrice,
  };
}

function resolveDefaultStoreSettings(): StoreSettings {
  return { ...defaultStoreSettings, locale: getBrowserLocale(defaultStoreSettings.locale) };
}

function shouldUseBrowserLocale(settings: StoreSettings) {
  return settings.locale === defaultStoreSettings.locale && settings.updatedAt === defaultStoreSettings.updatedAt;
}

const catalogRepository: CatalogRepository = {
  async listProducts(filters) {
    const items = await getAllFromStore<Product>(STORE_NAMES.products);
    return sortByUpdatedAtDesc(items).filter((product) => matchesProductFilters(product, filters));
  },

  async listActiveProducts(filters) {
    return catalogRepository.listProducts({ ...filters, status: "active" });
  },

  async getProductById(id) {
    return getFromStore<Product>(STORE_NAMES.products, id);
  },

  async getProductBySlug(slug) {
    return getFromIndex<Product>(STORE_NAMES.products, "slug", slug);
  },

  async saveProduct(product) {
    return putInStore(STORE_NAMES.products, product);
  },

  async deleteProduct(id) {
    return deleteFromStore(STORE_NAMES.products, id);
  },
};

const cartRepository: CartRepository = {
  async getCart() {
    return calculateCart(await getAllFromStore<CartItem>(STORE_NAMES.cart));
  },

  async addItem(input) {
    const nextItem = createCartItem(input);
    const existing = await getFromStore<CartItem>(STORE_NAMES.cart, nextItem.id);
    const item = existing ? { ...existing, quantity: existing.quantity + nextItem.quantity } : nextItem;

    await putInStore(STORE_NAMES.cart, item);
    const cart = await cartRepository.getCart();
    dispatchCartUpdatedEvent(cart);
    return cart;
  },

  async updateQuantity(itemId, quantity) {
    const existing = await getFromStore<CartItem>(STORE_NAMES.cart, itemId);
    if (!existing) return cartRepository.getCart();

    if (quantity <= 0) {
      await deleteFromStore(STORE_NAMES.cart, itemId);
      const cart = await cartRepository.getCart();
      dispatchCartUpdatedEvent(cart);
      return cart;
    }

    await putInStore(STORE_NAMES.cart, { ...existing, quantity });
    const cart = await cartRepository.getCart();
    dispatchCartUpdatedEvent(cart);
    return cart;
  },

  async removeItem(itemId) {
    await deleteFromStore(STORE_NAMES.cart, itemId);
    const cart = await cartRepository.getCart();
    dispatchCartUpdatedEvent(cart);
    return cart;
  },

  async clearCart() {
    await clearStore(STORE_NAMES.cart);
    const cart = await cartRepository.getCart();
    dispatchCartUpdatedEvent(cart);
    return cart;
  },
};

const ordersRepository: OrdersRepository = {
  async listOrders() {
    return sortByUpdatedAtDesc(await getAllFromStore<Order>(STORE_NAMES.orders));
  },

  async getOrderById(id) {
    return getFromStore<Order>(STORE_NAMES.orders, id);
  },

  async saveOrder(order) {
    return putInStore(STORE_NAMES.orders, order);
  },
};

const discountsRepository: DiscountsRepository = {
  async listDiscounts() {
    return sortByUpdatedAtDesc(await getAllFromStore<Discount>(STORE_NAMES.discounts));
  },

  async getDiscountByCode(code) {
    return getFromIndex<Discount>(STORE_NAMES.discounts, "code", code.toUpperCase());
  },

  async saveDiscount(discount) {
    return putInStore(STORE_NAMES.discounts, { ...discount, code: discount.code.toUpperCase() });
  },

  async deleteDiscount(id) {
    return deleteFromStore(STORE_NAMES.discounts, id);
  },
};

const settingsRepository: SettingsRepository = {
  async getStoreSettings() {
    const storedSettings = await getFromStore<StoreSettings>(STORE_NAMES.settings, defaultStoreSettings.id);

    if (!storedSettings) {
      return resolveDefaultStoreSettings();
    }

    if (shouldUseBrowserLocale(storedSettings)) {
      return { ...storedSettings, locale: getBrowserLocale(defaultStoreSettings.locale) };
    }

    return storedSettings;
  },

  async saveStoreSettings(settings) {
    return putInStore(STORE_NAMES.settings, settings);
  },
};

export function createBrowserRepositories(): CommerceRepositories {
  if (typeof window === "undefined") {
    throw new Error("Browser repositories cannot be created during server rendering.");
  }

  return {
    catalog: catalogRepository,
    cart: cartRepository,
    orders: ordersRepository,
    discounts: discountsRepository,
    settings: settingsRepository,
  };
}

export function getBrowserRepositories(): CommerceRepositories | null {
  if (typeof window === "undefined") return null;
  return createBrowserRepositories();
}
