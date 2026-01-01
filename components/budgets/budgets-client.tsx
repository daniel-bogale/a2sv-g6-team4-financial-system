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
}

export function BudgetsClient({ budgets, pagination }: BudgetsClientProps) {
  return (
    <BudgetsTable
      data={budgets}
      total={pagination.total}
      totalPages={pagination.totalPages}
    />
  );
}

