"use server";

import { revalidatePath } from "next/cache";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import type { User } from "@/components/users/users-types";

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetUsersResult {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const SORTABLE_COLUMNS = new Set(["full_name", "role"]);

export async function getUsers(
  params: GetUsersParams = {}
): Promise<GetUsersResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      role = [],
      sortBy = "full_name",
      sortOrder = "asc",
    } = params;

    const adminClient = createSupabaseAdminClient();

    // Get users from auth.users with app_metadata
    const { data: authData, error: authError } =
      await adminClient.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users from auth:", authError);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    let users = authData.users.map((user) => ({
      id: user.id,
      full_name: user.email || user.user_metadata?.full_name || "Unknown",
      role: (user.app_metadata?.role as string) || "STAFF",
    }));

    // Apply role filter
    if (role.length > 0) {
      users = users.filter((user) => role.includes(user.role));
    }

    // Apply search filter (search in full_name/email)
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      users = users.filter((user) =>
        user.full_name.toLowerCase().includes(searchTerm)
      );
    }

    const total = users.length;
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Apply sorting
    const validSortBy = SORTABLE_COLUMNS.has(sortBy) ? sortBy : "full_name";
    const ascending = sortOrder === "asc";

    users.sort((a, b) => {
      const aVal = a[validSortBy as keyof typeof a] || "";
      const bVal = b[validSortBy as keyof typeof b] || "";
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return ascending ? comparison : -comparison;
    });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedUsers = users.slice(from, to);

    return {
      data: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();

    // Check if the current user has permission (must be FINANCE role)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Check current user's role from app_metadata
    const currentUserRole = user.app_metadata?.role as string;

    if (!currentUserRole || currentUserRole !== "FINANCE") {
      return { error: "Only FINANCE users can update roles" };
    }

    // Validate the new role
    const validRoles = ["STAFF", "FINANCE"];
    if (!validRoles.includes(newRole)) {
      return { error: "Invalid role" };
    }

    // Update the user's role in app_metadata
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      app_metadata: { role: newRole },
    });

    if (error) {
      console.error("Error updating user role:", error);
      return { error: "Failed to update user role" };
    }

    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return { error: "Failed to update user role" };
  }
}
