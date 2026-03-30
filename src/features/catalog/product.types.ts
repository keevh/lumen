export type ProductStatus = "active" | "draft";

export type ProductImage = {
  url: string;
  alt: string;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  colors: string[];
  sizes: string[];
  images: ProductImage[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  name: string;
  material: string;
  color: string;
  image: string;
  badge?: string;
};

export type ProductFilters = {
  category?: string;
  status?: ProductStatus;
};

export interface CatalogRepository {
  listProducts(filters?: ProductFilters): Promise<Product[]>;
  listActiveProducts(filters?: Omit<ProductFilters, "status">): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  saveProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
