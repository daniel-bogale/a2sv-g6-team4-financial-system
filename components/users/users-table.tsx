"use client";

import { useEffect, useState, useMemo } from 'react'
import {
    type SortingState,
    type VisibilityState,
    type ColumnFiltersState,
    type OnChangeFn,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { createUsersColumns } from './users-columns'
import type { User } from './users-types'
import { DataTablePagination } from '../data-table/pagination'
import { DataTableToolbar } from '../data-table/toolbar'
import { useQueryStates } from 'nuqs'
import { usersSearchParams } from '@/app/(protected)/users/search-params'

type UsersTableProps = {
    data: User[]
    total: number
    totalPages: number
    userRole: string | null
}

const ALLOWED_SORT_COLUMNS = new Set([
    'full_name',
    'role',
])

export function UsersTable({ data, totalPages, userRole }: UsersTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [queryState, setQueryState] = useQueryStates(usersSearchParams, {
        history: 'push',
        shallow: false,
    })

    const pagination = useMemo(
        () => ({
            pageIndex: Math.max(0, queryState.page - 1),
            pageSize: queryState.pageSize,
        }),
        [queryState.page, queryState.pageSize]
    )

    const onPaginationChange = (
        updater:
            | typeof pagination
            | ((prev: typeof pagination) => typeof pagination)
    ) => {
        const next = typeof updater === 'function' ? updater(pagination) : updater
        setQueryState({
            page: next.pageIndex + 1,
            pageSize: next.pageSize,
        })
    }

    const sorting: SortingState = useMemo(() => {
        if (queryState.sortBy) {
            return [
                {
                    id: queryState.sortBy,
                    desc: queryState.sortOrder === 'desc',
                },
            ]
        }
        return []
    }, [queryState.sortBy, queryState.sortOrder])

    const onSortingChange = (
        updater: SortingState | ((prev: SortingState) => SortingState)
    ) => {
        const next = typeof updater === 'function' ? updater(sorting) : updater
        if (next.length > 0) {
            const sort = next[0]
            const sortBy = ALLOWED_SORT_COLUMNS.has(sort.id)
                ? sort.id
                : 'created_at'
            setQueryState({
                sortBy,
                sortOrder: sort.desc ? 'desc' : 'asc',
                page: 1,
            })
        } else {
            setQueryState({
                sortBy: null,
                sortOrder: null,
                page: 1,
            })
        }
    }

    const columnFilters = useMemo(() => {
        const filters: ColumnFiltersState = []
        if (queryState.role.length > 0) {
            filters.push({ id: 'role', value: queryState.role })
        }
        return filters
    }, [queryState.role])

    const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
        const next = typeof updater === 'function' ? updater(columnFilters) : updater
        const roleFilter = next.find((filter) => filter.id === 'role')
        setQueryState({
            role:
                roleFilter && Array.isArray(roleFilter.value)
                    ? (roleFilter.value as string[])
                    : [],
            page: 1,
        })
    }

    const globalFilter = queryState.search

    const onGlobalFilterChange: OnChangeFn<string> = (updater) => {
        const next =
            typeof updater === 'function' ? updater(globalFilter ?? '') : updater
        setQueryState({
            search: next && next.length > 0 ? next : null,
            page: 1,
        })
    }

    const columns = createUsersColumns(userRole)

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        enableRowSelection: true,
        manualPagination: true,
        manualSorting: true,
        pageCount: totalPages,
        onPaginationChange,
        onColumnFiltersChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        if (queryState.page > totalPages && totalPages > 0) {
            setQueryState({ page: totalPages })
        }
    }, [queryState.page, totalPages, setQueryState])

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder='Search users...'
                filters={[
                    {
                        columnId: 'role',
                        title: 'Role',
                        options: [
                            { label: 'Staff', value: 'STAFF' },
                            { label: 'Finance', value: 'FINANCE' },
                        ],
                    },
                ]}
            />            <div className='rounded-lg border bg-card'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
