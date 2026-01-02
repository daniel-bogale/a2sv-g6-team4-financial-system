"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { type Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    className?: string
    totalRows?: number
}

export function DataTablePagination<TData>({
    table,
    className,
    totalRows,
}: DataTablePaginationProps<TData>) {
    // Use totalRows for server-side pagination, otherwise use client-side filtered count
    const totalRowCount = totalRows ?? table.getFilteredRowModel().rows.length
    const selectedCount = table.getFilteredSelectedRowModel().rows.length
    
    return (
        <div className={`flex flex-wrap items-center justify-between gap-2 px-2 ${className || ""}`}>
            <div className="text-muted-foreground text-sm whitespace-nowrap">
                {selectedCount > 0 ? `${selectedCount} of ` : ""}
                {totalRowCount} row(s){selectedCount > 0 ? " selected" : ""}
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <p className="hidden text-sm font-medium sm:block">Rows per page</p>
                    <p className="text-sm font-medium sm:hidden">Rows</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center text-sm font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">Page </span>
                    {table.getState().pagination.pageIndex + 1} <span className="mx-0.5">/</span>{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

