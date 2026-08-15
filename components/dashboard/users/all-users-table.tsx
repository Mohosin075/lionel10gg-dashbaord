"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  type AppUser,
} from "@/redux/features/user/userApi";
import { MoreVertical, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function mapStatusBadge(status?: string) {
  if (status === "active") return "active" as const;
  if (status === "inactive") return "restricted" as const;
  if (status === "deleted") return "banned" as const;
  return "restricted" as const;
}

function mapStatusLabel(status?: string) {
  if (status === "active") return "active";
  if (status === "inactive") return "restricted";
  if (status === "deleted") return "banned";
  return status || "unknown";
}

function premiumLabel(user: AppUser) {
  const status = (user.subscriptionStatus || "").toLowerCase();
  if (status === "active") return "Premium";
  if (status === "trialing" || status === "trial") return "Trial";
  return "Free";
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default function AllUsersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetUsersQuery({
    page: 1,
    limit: 50,
    searchTerm: debouncedSearch || undefined,
  });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const users: AppUser[] = data?.data || [];

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleSearchSubmit = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value.trim());
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const res = await updateStatus({ userId, status }).unwrap();
      toast.success(res.message || "User status updated");
      setMenuOpenId(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update status");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-5 px-6 border-b border-slate-100">
        <CardTitle className="text-base font-semibold">All Users</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:bg-white h-9"
            value={search}
            onChange={(e) => handleSearchSubmit(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading users...</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-500">Failed to load users.</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.name || "—"}
                  </TableCell>
                  <TableCell>{user.email || "—"}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.updatedAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        premiumLabel(user) === "Premium"
                          ? "active"
                          : premiumLabel(user) === "Trial"
                            ? "restricted"
                            : "secondary"
                      }
                    >
                      {premiumLabel(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={mapStatusBadge(user.status)}
                      className="capitalize"
                    >
                      {mapStatusLabel(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600"
                      disabled={isUpdating}
                      onClick={() =>
                        setMenuOpenId((id) =>
                          id === user._id ? null : user._id,
                        )
                      }
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                    {menuOpenId === user._id ? (
                      <div className="absolute right-4 top-10 z-10 w-40 rounded-md border bg-white shadow-md text-left">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-sm hover:bg-slate-50"
                          onClick={() =>
                            handleStatusChange(user._id, "active")
                          }
                        >
                          Set Active
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-sm hover:bg-slate-50"
                          onClick={() =>
                            handleStatusChange(user._id, "inactive")
                          }
                        >
                          Restrict
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleStatusChange(user._id, "deleted")
                          }
                        >
                          Ban / Delete
                        </button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
