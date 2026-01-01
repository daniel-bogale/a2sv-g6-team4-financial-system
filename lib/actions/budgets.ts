"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Budget } from "@/components/budgets/budgets-types";

export interface GetBudgetsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string[];
  department?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetBudgetsResult {
  data: Budget[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const SORTABLE_COLUMNS = new Set([
  "department",
  "period",
  "amount",
  "used",
  "status",
  "created_at",
]);

export async function getBudgets(
  params: GetBudgetsParams = {}
): Promise<GetBudgetsResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      status = [],
      department = [],
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    const supabase = await createSupabaseServerClient();

    // Build query with filters
    let query = supabase.from("budgets").select("*", { count: "exact" });

    // Apply status filter
    if (status.length > 0) {
      query = query.in("status", status);
    }

    // Apply department filter
    if (department.length > 0) {
      query = query.in("department", department);
    }

    // Apply search filter (search in department and period)
    if (search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query = query.or(
        `department.ilike.${searchTerm},period.ilike.${searchTerm}`
      );
    }

    // Get total count with filters applied
    const { count, error: countError } = await query;

    if (countError) {
      console.error("Error fetching budgets count:", countError);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Validate and set sort column
    const validSortBy = SORTABLE_COLUMNS.has(sortBy) ? sortBy : "created_at";
    const ascending = sortOrder === "asc";

    // Calculate offset
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Rebuild query for fetching data with same filters
    let dataQuery = supabase.from("budgets").select("*");

    // Apply same filters
    if (status.length > 0) {
      dataQuery = dataQuery.in("status", status);
    }

    if (department.length > 0) {
      dataQuery = dataQuery.in("department", department);
    }

    if (search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      dataQuery = dataQuery.or(
        `department.ilike.${searchTerm},period.ilike.${searchTerm}`
      );
    }

    // Fetch paginated data
    const { data, error } = await dataQuery
      .order(validSortBy, { ascending })
      .range(from, to);

    if (error) {
      console.error("Error fetching budgets:", error);
      return {
        data: [],
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    // Transform the data to match the Budget type
    const budgets: Budget[] = (data || []).map((budget) => ({
      id: budget.id,
      department: budget.department,
      period: budget.period,
      amount: budget.amount,
      used: budget.used || 0,
      status: budget.status,
      created_by: budget.created_by,
      created_at: budget.created_at,
    }));

    return {
      data: budgets,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Unexpected error fetching budgets:", error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    };
  }
}
