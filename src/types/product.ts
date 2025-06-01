export interface UnitPrice {
  _id: string;
  unit: string;
  pricePerUnit: number;
  isBaseUnit: boolean;
  stock: number;
  equalWith: number;
}

export interface Store {
  _id: string;
  storeName: string;
  description?: string;
  averageRating: number;
  storeAddress?: string;
  whatsAppNumber?: string;
  instagram?: string;
  facebook?: string;
  officialWebsite?: string;
}

export interface Product {
  _id: string;
  wasteName: string;
  description: string;
  imageUrls: string[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  store: Store;
  unitPrices: UnitPrice[];
} 