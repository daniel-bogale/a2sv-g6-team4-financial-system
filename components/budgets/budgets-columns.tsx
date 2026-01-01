"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Budget } from "./budgets-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    case "REJECTED":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
}

export function createBudgetsColumns(): ColumnDef<Budget>[] {
  return [
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("department")}</div>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => <div>{row.getValue("period")}</div>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return <div className="text-right">{formatCurrency(amount)}</div>;
      },
    },
    {
      accessorKey: "used",
      header: () => <div className="text-right">Used</div>,
      cell: ({ row }) => {
        const used = parseFloat(row.getValue("used"));
        const amount = parseFloat(row.original.amount);
        const usagePercentage = (used / amount) * 100;
        return (
          <div className="text-right">
            {formatCurrency(used)}
            <span className="ml-2 text-xs text-muted-foreground">
              ({usagePercentage.toFixed(1)}%)
            </span>
          </div>
        );
      },
    },
    {
      id: "remaining",
      header: () => <div className="text-right">Remaining</div>,
      cell: ({ row }) => {
        const remaining = row.original.amount - row.original.used;
        return <div className="text-right">{formatCurrency(remaining)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={cn(getStatusColor(status))}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return <div>{formatDate(date)}</div>;
      },
    },
  ];
}

