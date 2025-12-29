/**
 * Authentication and Authorization Types
 */

/**
 * User roles in the system
 */
export type UserRole = "super_admin" | "admin" | "staff";

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
  staff: 1,
  admin: 2,
  super_admin: 3,
} as const;

/**
 * Route-based role permissions
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/users": ["super_admin", "admin"],
  "/settings": ["super_admin", "admin", "staff"],
  "/home": ["super_admin", "admin", "staff"],
} as const;
