"use client";

import { BudgetsTable } from "./budgets-table";
import type { Budget } from "./budgets-types";

interface BudgetsClientProps {
  budgets: Budget[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  userRole: string | null;
}

export function BudgetsClient({ budgets, pagination, userRole }: BudgetsClientProps) {
  return (
    <BudgetsTable
      data={budgets}
      total={pagination.total}
      totalPages={pagination.totalPages}
      userRole={userRole}
    />
  );
}

