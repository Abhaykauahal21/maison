export type ProductCategory = "Electronics" | "Furniture" | "Apparel" | "Accessories" | "Software";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
  rating: number;
  imageUrl?: string;
  tags: string[];
}

export interface ProductFilterDto {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
}
