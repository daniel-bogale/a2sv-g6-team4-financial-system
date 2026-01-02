import ExpensesTable from "@/components/expenses/ExpensesTable";

export default function ExpensesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Expenses</h1>
      <ExpensesTable />
    </div>
  );
}
