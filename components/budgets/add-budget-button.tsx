"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { BudgetCreateForm } from "./budget-create-form";

export function AddBudgetButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Budget
      </Button>
      <BudgetCreateForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}

