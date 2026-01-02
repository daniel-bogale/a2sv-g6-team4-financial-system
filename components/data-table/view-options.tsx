"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { type Table } from "@tanstack/react-table"
import { Settings2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )

  const visibleColumnsCount = toggleableColumns.filter(
    (column) => column.getIsVisible()
  ).length

  const hiddenColumnsCount = toggleableColumns.length - visibleColumnsCount

  const handleToggle = (column: (typeof toggleableColumns)[0], value: boolean) => {
    // Prevent hiding if it would leave less than 3 visible columns
    if (!value && visibleColumnsCount <= 1) {
      return
    }
    column.toggleVisibility(!!value)
  }

  const handleReset = () => {
    toggleableColumns.forEach((column) => {
      if (!column.getIsVisible()) {
        column.toggleVisibility(true)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 ml-auto"
        >
          <Settings2 className="h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {toggleableColumns.map((column) => {
          const isVisible = column.getIsVisible()
          // Disable hiding if it would leave less than 3 visible columns
          const wouldLeaveLessThanThree = isVisible && visibleColumnsCount <= 2

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={isVisible}
              onCheckedChange={(value) => handleToggle(column, !!value)}
              disabled={wouldLeaveLessThanThree}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          )
        })}
        {hiddenColumnsCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleReset}
              className="cursor-pointer"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

