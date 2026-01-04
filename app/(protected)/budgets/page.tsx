import { Main } from "@/components/layout/main";
import { BudgetsClient } from "@/components/budgets/budgets-client";
import { AddBudgetButton } from "@/components/budgets/add-budget-button";
import { getBudgets } from "@/lib/actions/budgets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadBudgetsSearchParams } from "./search-params";
import type { SearchParams } from "nuqs/server";

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic';

interface BudgetsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const params = await loadBudgetsSearchParams(searchParams);
  const paginatedBudgets = await getBudgets({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    status: params.status.length > 0 ? params.status : undefined,
    department: params.department.length > 0 ? params.department : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder === "asc" ? "asc" : "desc",
  });

  // Get user role
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | null = null;
  if (user) {
    userRole = (user.app_metadata?.role as string) || null;
  }

  return (
    <Main>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Budgets</h1>
            <AddBudgetButton />
          </div>
          <p className="text-base text-muted-foreground">
            Manage and view budgets across departments
          </p>
        </div>

        {/* Budgets List */}
        <div className="animate-in fade-in-50 duration-500">
          <BudgetsClient
            budgets={paginatedBudgets.data}
            pagination={{
              total: paginatedBudgets.total,
              page: paginatedBudgets.page,
              pageSize: paginatedBudgets.pageSize,
              totalPages: paginatedBudgets.totalPages,
            }}
            userRole={userRole}
          />
        </div>
      </div>
    </Main>
  );
}

