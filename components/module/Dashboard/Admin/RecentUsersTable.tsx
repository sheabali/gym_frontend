"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Admin" | "Manager" | "User";
  status: "Active" | "Pending" | "Suspended";
  joinedAt: string;
  lastActive: string;
}

export default function RecentUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const initialUsers: UserRecord[] = [
    {
      id: "usr-1",
      name: "Alexander Wright",
      email: "alexander.w@example.com",
      role: "Admin",
      status: "Active",
      joinedAt: "Aug 12, 2026",
      lastActive: "2 mins ago",
    },
    {
      id: "usr-2",
      name: "Sophia Chen",
      email: "sophia.chen@example.com",
      role: "Manager",
      status: "Active",
      joinedAt: "Aug 10, 2026",
      lastActive: "1 hour ago",
    },
    {
      id: "usr-3",
      name: "Marcus Vance",
      email: "m.vance@example.com",
      role: "User",
      status: "Pending",
      joinedAt: "Aug 09, 2026",
      lastActive: "Yesterday",
    },
    {
      id: "usr-4",
      name: "Elena Rostova",
      email: "elena.r@example.com",
      role: "User",
      status: "Active",
      joinedAt: "Aug 08, 2026",
      lastActive: "3 days ago",
    },
    {
      id: "usr-5",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "User",
      status: "Suspended",
      joinedAt: "Aug 01, 2026",
      lastActive: "1 week ago",
    },
  ];

  const [users, setUsers] = useState<UserRecord[]>(initialUsers);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    userId: string,
    newStatus: "Active" | "Suspended"
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    toast.success(`User status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: UserRecord["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Suspended
          </span>
        );
    }
  };

  const getRoleBadge = (role: UserRecord["role"]) => {
    switch (role) {
      case "Admin":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Admin
          </span>
        );
      case "Manager":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            User
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xs border border-gray-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Recent Users & Accounts
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage registrations, credentials, and user privileges
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xs border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
            />
          </div>

          <div className="inline-flex p-0.5 bg-gray-100 rounded-xs border border-gray-200 text-xs font-medium">
            {["All", "Active", "Pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer ${
                  statusFilter === tab
                    ? "bg-white text-gray-900 shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/80 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-xs border border-gray-200">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="rounded-xs bg-gray-100 text-gray-800 font-semibold text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {user.name}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-3.5 px-4 text-gray-600 text-xs">
                    {user.joinedAt}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">
                    {user.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-xs text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xs w-44 shadow-lg border-gray-200 text-xs"
                      >
                        <DropdownMenuLabel className="text-[11px] text-gray-500">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => toast.info(`Viewing ${user.name}`)}
                          className="cursor-pointer"
                        >
                          <UserCheck size={14} className="mr-2 text-gray-600" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toast.info(`Editing ${user.name}`)}
                          className="cursor-pointer"
                        >
                          <Shield size={14} className="mr-2 text-gray-600" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Active" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user.id, "Suspended")
                            }
                            className="cursor-pointer text-amber-600 hover:text-amber-700"
                          >
                            <UserX size={14} className="mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user.id, "Active")
                            }
                            className="cursor-pointer text-emerald-600 hover:text-emerald-700"
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            toast.error(`Removed user ${user.name}`)
                          }
                          className="cursor-pointer text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 mt-2 text-xs text-gray-500">
        <span>Showing 1 to {filteredUsers.length} of 14,892 users</span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 rounded-xs border-gray-200 text-xs"
            disabled
          >
            <ChevronLeft size={14} className="mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 rounded-xs border-gray-200 text-xs cursor-pointer hover:bg-gray-50"
          >
            Next
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
