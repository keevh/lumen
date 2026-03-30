export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  variant: string;
  unitPrice: number;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: string;
};

export type CartItemInput = {
  productId: string;
  slug: string;
  name: string;
  variant: string;
  unitPrice: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
};

export interface CartRepository {
  getCart(): Promise<Cart>;
  addItem(item: CartItemInput): Promise<Cart>;
  updateQuantity(itemId: string, quantity: number): Promise<Cart>;
  removeItem(itemId: string): Promise<Cart>;
  clearCart(): Promise<Cart>;
}
