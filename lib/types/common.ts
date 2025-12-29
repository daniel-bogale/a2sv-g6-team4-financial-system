/**
 * Common Types
 */

/**
 * Result type for protected server actions
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Pagination parameters
 */
export type PaginationParams = {
  page: number;
  limit: number;
};

/**
 * Paginated response wrapper
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Sort order
 */
export type SortOrder = "asc" | "desc";

/**
 * Next.js redirect error type
 */
export type NextRedirectError = Error & {
  digest?: string;
  name?: string;
};

/**
 * Type guard to check if an error is a Next.js redirect
 */
export function isNextRedirectError(
  error: unknown
): error is NextRedirectError {
  if (!error || typeof error !== "object") return false;
  const err = error as NextRedirectError;
  return (
    err.digest?.includes("NEXT_REDIRECT") ||
    err.message?.includes("NEXT_REDIRECT") ||
    err.name === "NEXT_REDIRECT"
  );
}
