/**
 * Validated and typed environment configuration.
 * Avoids direct process.env calls across the codebase.
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/v1",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Maison d'Vine",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  enableMockFallback: process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== "false",
} as const;
