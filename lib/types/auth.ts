/**
 * Authentication and Authorization Types
 */

/**
 * User roles in the system
 */
export type UserRole = "FINANCE" | "STAFF";

/**
 * User profile data structure
 */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole | null;
};

/**
 * Role hierarchy levels for permission checks
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  STAFF: 1,
  FINANCE: 2,
} as const;

/**
 * Route-based role permissions
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/home": ["FINANCE", "STAFF"],
  "/settings": ["FINANCE", "STAFF"],
  "/users": ["FINANCE"],
} as const;
