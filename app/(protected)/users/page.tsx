import { Main } from "@/components/layout/main";
import { UsersClient } from "@/components/users/users-client";
import { getUsers } from "@/lib/actions/users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadUsersSearchParams } from "./search-params";
import type { SearchParams } from "nuqs/server";
import { redirect } from "next/navigation";

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic';

interface UsersPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    // Check if user has FINANCE role
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const userRole = (user.app_metadata?.role as string) || null;

    // Only FINANCE users can access this page
    if (userRole !== "FINANCE") {
        redirect("/403");
    } const params = await loadUsersSearchParams(searchParams);
    const paginatedUsers = await getUsers({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search || undefined,
        role: params.role.length > 0 ? params.role : undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder === "asc" ? "asc" : "desc",
    });

    return (
        <Main>
            <div className="space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">User Management</h1>
                    </div>
                    <p className="text-base text-muted-foreground">
                        Manage user roles and permissions
                    </p>
                </div>

                {/* Users List */}
                <div className="animate-in fade-in-50 duration-500">
                    <UsersClient
                        users={paginatedUsers.data}
                        pagination={{
                            total: paginatedUsers.total,
                            page: paginatedUsers.page,
                            pageSize: paginatedUsers.pageSize,
                            totalPages: paginatedUsers.totalPages,
                        }}
                        userRole={userRole}
                    />
                </div>
            </div>
        </Main>
    );
}
