import type { CartRepository } from "@/features/cart/cart.types";
import type { CatalogRepository } from "@/features/catalog/product.types";
import type { DiscountsRepository } from "@/features/discounts/discount.types";
import type { OrdersRepository } from "@/features/orders/order.types";
import type { SettingsRepository } from "@/features/settings/settings.types";

export type CommerceRepositories = {
  catalog: CatalogRepository;
  cart: CartRepository;
  orders: OrdersRepository;
  discounts: DiscountsRepository;
  settings: SettingsRepository;
};
