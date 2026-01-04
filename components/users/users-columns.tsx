"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import type { User } from "./users-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/users";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function getRoleColor(role: string): string {
    switch (role?.toUpperCase()) {
        case "FINANCE":
            return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
        case "STAFF":
            return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
        default:
            return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
}

function UserRoleActions({ user }: { user: User }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);

    const handleRoleChange = () => {
        if (selectedRole === user.role) {
            setShowRoleDialog(false);
            return;
        }

        startTransition(async () => {
            const result = await updateUserRole(user.id, selectedRole);
            if (result?.error) {
                toast.error("Failed to update role" + (result.error ? `: ${result.error}` : ''));
            } else {
                toast.success(`Role updated to ${selectedRole} successfully`);
                router.refresh();
            }
            setShowRoleDialog(false);
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreVertical className="h-4 w-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowRoleDialog(true)}
                        disabled={isPending}
                    >
                        Change Role
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change User Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Update the role for <strong>{user.full_name}</strong>. Current role: <strong>{user.role}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STAFF">Staff</SelectItem>
                                <SelectItem value="FINANCE">Finance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange();
                            }}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Role"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function createUsersColumns(userRole: string | null): ColumnDef<User>[] {
    const isFinance = userRole === "FINANCE";

    return [
        {
            accessorKey: "full_name",
            header: "Name",
            cell: ({ row }) => {
                const name = row.getValue("full_name") as string;
                return <div className="font-medium">{name}</div>;
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                return (
                    <Badge
                        variant="outline"
                        className={cn("font-medium", getRoleColor(role))}
                    >
                        {role}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        ...(isFinance
            ? [
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => {
                        return <UserRoleActions user={row.original} />;
                    },
                } as ColumnDef<User>,
            ]
            : []),
    ];
}