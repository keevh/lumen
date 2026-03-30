import { products } from "@/data/catalog";
import type { CartItem } from "@/features/cart/cart.types";
import type { Product } from "@/features/catalog/product.types";
import type { Discount } from "@/features/discounts/discount.types";
import type { Order } from "@/features/orders/order.types";
import type { StoreSettings } from "@/features/settings/settings.types";

const DB_NAME = "lumens-commerce";
const DB_VERSION = 1;

export const STORE_NAMES = {
  products: "products",
  cart: "cart",
  orders: "orders",
  discounts: "discounts",
  settings: "settings",
} as const;

type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];
type DbRecord = Product | CartItem | Order | Discount | StoreSettings;

export const defaultStoreSettings: StoreSettings = {
  id: "store",
  storeName: "LUMEN",
  currency: "USD",
  taxRate: 0.1,
  locale: "es-AR",
  updatedAt: "2026-06-12T00:00:00.000Z",
};

function assertBrowser() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    throw new Error("IndexedDB repositories are only available in the browser.");
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

function createStores(db: IDBDatabase) {
  if (!db.objectStoreNames.contains(STORE_NAMES.products)) {
    const productStore = db.createObjectStore(STORE_NAMES.products, { keyPath: "id" });
    productStore.createIndex("slug", "slug", { unique: true });
    productStore.createIndex("category", "category", { unique: false });
    productStore.createIndex("status", "status", { unique: false });
    productStore.createIndex("updatedAt", "updatedAt", { unique: false });
  }

  if (!db.objectStoreNames.contains(STORE_NAMES.cart)) {
    db.createObjectStore(STORE_NAMES.cart, { keyPath: "id" });
  }

  if (!db.objectStoreNames.contains(STORE_NAMES.orders)) {
    const orderStore = db.createObjectStore(STORE_NAMES.orders, { keyPath: "id" });
    orderStore.createIndex("status", "status", { unique: false });
    orderStore.createIndex("createdAt", "createdAt", { unique: false });
  }

  if (!db.objectStoreNames.contains(STORE_NAMES.discounts)) {
    const discountStore = db.createObjectStore(STORE_NAMES.discounts, { keyPath: "id" });
    discountStore.createIndex("code", "code", { unique: true });
    discountStore.createIndex("status", "status", { unique: false });
  }

  if (!db.objectStoreNames.contains(STORE_NAMES.settings)) {
    db.createObjectStore(STORE_NAMES.settings, { keyPath: "id" });
  }
}

function seedInitialData(transaction: IDBTransaction) {
  const productStore = transaction.objectStore(STORE_NAMES.products);
  for (const item of products) {
    productStore.put(item);
  }

  transaction.objectStore(STORE_NAMES.settings).put(defaultStoreSettings);
}

export function openBrowserDb(): Promise<IDBDatabase> {
  assertBrowser();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      createStores(db);

      if (event.oldVersion === 0 && request.transaction) {
        seedInitialData(request.transaction);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFromStore<T extends DbRecord>(storeName: StoreName): Promise<T[]> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readonly");
  return requestToPromise<T[]>(transaction.objectStore(storeName).getAll());
}

export async function getFromStore<T extends DbRecord>(storeName: StoreName, key: IDBValidKey): Promise<T | null> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readonly");
  const result = await requestToPromise<T | undefined>(transaction.objectStore(storeName).get(key));
  return result ?? null;
}

export async function getFromIndex<T extends DbRecord>(storeName: StoreName, indexName: string, key: IDBValidKey): Promise<T | null> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readonly");
  const result = await requestToPromise<T | undefined>(transaction.objectStore(storeName).index(indexName).get(key));
  return result ?? null;
}

export async function putInStore<T extends DbRecord>(storeName: StoreName, value: T): Promise<T> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).put(value);
  await transactionDone(transaction);
  return value;
}

export async function deleteFromStore(storeName: StoreName, key: IDBValidKey): Promise<void> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).delete(key);
  await transactionDone(transaction);
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openBrowserDb();
  const transaction = db.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).clear();
  await transactionDone(transaction);
}
