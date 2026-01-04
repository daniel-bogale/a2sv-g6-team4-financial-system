"use client";

import { UsersTable } from "./users-table";
import type { User } from "./users-types";

interface UsersClientProps {
    users: User[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    userRole: string | null;
}

export function UsersClient({ users, pagination, userRole }: UsersClientProps) {
    return (
        <UsersTable
            data={users}
            total={pagination.total}
            totalPages={pagination.totalPages}
            userRole={userRole}
        />
    );
}
