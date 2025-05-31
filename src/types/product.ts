export interface UnitPrice {
  _id: string;
  unit: string;
  pricePerUnit: number;
  isBaseUnit: boolean;
  stock: number;
  equalWith: number;
}

export interface Product {
  _id: string;
  wasteName: string;
  description: string;
  imageUrls: string[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  store: {
    _id: string;
    storeName: string;
  };
  unitPrices: UnitPrice[];
} 