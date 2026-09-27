import { apiClient } from "@/services/api-client";
import { Product, ProductFilterDto } from "@/types/product";
import { PaginatedResponse } from "@/types/api";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { env } from "@/config/env";
import { delay } from "@/lib/utils";

export class ProductService {
  private static readonly BASE_PATH = "/products";

  /**
   * Fetches paginated/filtered products.
   */
  static async getProducts(filters?: ProductFilterDto): Promise<PaginatedResponse<Product>> {
    try {
      return await apiClient.get<PaginatedResponse<Product>>(this.BASE_PATH, {
        params: filters as Record<string, string | number | boolean | undefined | null>,
      });
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(300);
        let list = [...MOCK_PRODUCTS];

        if (filters?.category) {
          list = list.filter((p) => p.category === filters.category);
        }
        if (filters?.inStockOnly) {
          list = list.filter((p) => p.inStock);
        }
        if (filters?.search) {
          const s = filters.search.toLowerCase();
          list = list.filter(
            (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
          );
        }

        return {
          data: list,
          pagination: {
            page: 1,
            limit: 10,
            total: list.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
      throw error;
    }
  }

  /**
   * Fetches single product by ID.
   */
  static async getProductById(id: string): Promise<Product> {
    try {
      return await apiClient.get<Product>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(200);
        const product = MOCK_PRODUCTS.find((p) => p.id === id);
        if (!product) {
          throw new Error(`Product with ID ${id} not found.`);
        }
        return product;
      }
      throw error;
    }
  }
}
