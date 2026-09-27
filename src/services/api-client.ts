import { env } from "@/config/env";
import { ApiError, ApiRequestOptions } from "@/types/api";

/**
 * Custom error class representing an API failure
 */
export class ApiException extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.statusCode = error.statusCode;
    this.code = error.code;
    this.errors = error.errors;
  }
}

/**
 * Builds URL with query parameters
 */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const url = new URL(
    path.startsWith("http") ? path : `${env.apiUrl}${path.startsWith("/") ? "" : "/"}${path}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Centralized API client abstraction
 */
class ApiClient {
  private defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  /**
   * Core request dispatcher with timeout, abort handling, and standardized error responses.
   */
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, timeout = 15000, headers, ...customConfig } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const mergedHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };

    const targetUrl = buildUrl(path, params);

    try {
      const response = await fetch(targetUrl, {
        ...customConfig,
        headers: mergedHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: Partial<ApiError> = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        throw new ApiException({
          message: errorData.message || `Request failed with status ${response.status}`,
          statusCode: response.status,
          code: errorData.code,
          errors: errorData.errors,
        });
      }

      // 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiException) {
        throw err;
      }

      if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiException({
          message: `Request timed out after ${timeout}ms`,
          statusCode: 408,
          code: "TIMEOUT",
        });
      }

      throw new ApiException({
        message: err instanceof Error ? err.message : "An unexpected network error occurred",
        statusCode: 500,
        code: "NETWORK_ERROR",
      });
    }
  }

  get<T>(path: string, options?: Omit<ApiRequestOptions, "method">): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: Omit<ApiRequestOptions, "method">): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
