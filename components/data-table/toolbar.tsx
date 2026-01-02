"use client";

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./faceted-filter"
import { DataTableViewOptions } from "./view-options"
import { useDebounce } from "@/hooks/use-debounce"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  // For global filter (server-side search), use debounced input
  const [searchValue, setSearchValue] = useState(
    table.getState().globalFilter ?? ""
  )
  const debouncedSearch = useDebounce(searchValue, 500)

  // Update global filter when debounced value changes
  useEffect(() => {
    if (table.getState().globalFilter !== debouncedSearch) {
      table.setGlobalFilter(debouncedSearch)
    }
  }, [debouncedSearch, table])

  // Sync local state with table state when it changes externally (e.g., from URL)
  useEffect(() => {
    const currentFilter = table.getState().globalFilter ?? ""
    if (currentFilter !== searchValue) {
      setSearchValue(currentFilter)
    }
  }, [table.getState().globalFilter])

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-full max-w-56"
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-8 w-full max-w-56"
          />
        )}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter("")
              setSearchValue("")
            }}
            className="h-8 px-2 lg:px-3 shrink-0"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />

      </div>
    </div>
  )
}

