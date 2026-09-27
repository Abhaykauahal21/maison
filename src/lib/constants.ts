/**
 * Global application constants
 */

export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT_MS: 15000,
  DEBOUNCE_DELAY_MS: 300,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const QUERY_KEYS = {
  USERS: {
    ALL: ["users"] as const,
    LIST: (page: number, limit: number) => ["users", "list", { page, limit }] as const,
    DETAIL: (id: string) => ["users", "detail", id] as const,
  },
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (filters?: Record<string, unknown>) => ["products", "list", filters] as const,
    DETAIL: (id: string) => ["products", "detail", id] as const,
    CATEGORIES: ["products", "categories"] as const,
  },
} as const;

export const STORAGE_KEYS = {
  THEME: "maisondvine_theme",
  SIDEBAR_COLLAPSED: "maisondvine_sidebar_collapsed",
} as const;
