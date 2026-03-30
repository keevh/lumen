export type DiscountStatus = "active" | "draft" | "expired";
export type DiscountType = "percentage" | "fixed";

export type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  status: DiscountStatus;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
};

export interface DiscountsRepository {
  listDiscounts(): Promise<Discount[]>;
  getDiscountByCode(code: string): Promise<Discount | null>;
  saveDiscount(discount: Discount): Promise<Discount>;
  deleteDiscount(id: string): Promise<void>;
}
