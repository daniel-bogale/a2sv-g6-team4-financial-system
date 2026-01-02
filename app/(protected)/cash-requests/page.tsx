import { Suspense } from "react";
import CashRequestTable from "@/components/cash-requests/CashRequestTable";
import Link from "next/link";

export default function CashRequestsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cash Requests</h1>
        <Link href="/cash-requests/new" className="px-3 py-2 rounded bg-primary text-primary-foreground">
          New Request
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CashRequestTable />
      </Suspense>
    </div>
  );
}
