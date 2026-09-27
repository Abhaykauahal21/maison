/**
 * Standard generic API response structure
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

/**
 * Standard paginated response envelope
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Standard API error contract
 */
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Common query string parameters for listing endpoints
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

/**
 * Custom request options for ApiClient
 */
export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeout?: number;
}
