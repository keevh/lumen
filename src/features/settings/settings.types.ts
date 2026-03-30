export type StoreSettings = {
  id: "store";
  storeName: string;
  currency: string;
  taxRate: number;
  locale: string;
  updatedAt: string;
};

export interface SettingsRepository {
  getStoreSettings(): Promise<StoreSettings>;
  saveStoreSettings(settings: StoreSettings): Promise<StoreSettings>;
}
