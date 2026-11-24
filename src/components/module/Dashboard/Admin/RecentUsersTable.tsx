"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAdminMembersQuery,
  useUpdateMemberStatusMutation,
  AdminMember,
} from "@/redux/api/adminApi";

export default function RecentUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const queryParams = {
    search: searchQuery.trim() || undefined,
    status: statusFilter === "All" ? undefined : statusFilter.toUpperCase(),
    page: currentPage,
    limit: 10,
  };

  const { data: membersResponse, isLoading, isFetching } = useGetAdminMembersQuery(queryParams) as any;
  const [updateMemberStatus, { isLoading: updatingStatus }] = useUpdateMemberStatusMutation();

  const members: AdminMember[] = membersResponse?.data?.members || [];
  const pagination = membersResponse?.data?.pagination || {
    total: members.length,
    page: 1,
    limit: 10,
    pages: 1,
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      await updateMemberStatus({ id: userId, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  const getStatusBadge = (status: AdminMember["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[11px] font-mono font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            ACTIVE
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[11px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            SUSPENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {status}
          </span>
        );
    }
  };

  const getRoleBadge = (role: AdminMember["role"]) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            ADMIN
          </span>
        );
      case "TRAINER":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            COACH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
            MEMBER
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0e0e12] p-5 sm:p-6 rounded-xs border border-white/[0.08] shadow-lg text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            Member Directory & Access Control
            {(isLoading || isFetching) && <Loader2 size={16} className="animate-spin text-[#22c55e]" />}
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Manage registrations, credential states, subscriptions, and access privileges
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <Input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs rounded-xs border-white/[0.1] bg-[#121216] text-white placeholder:text-zinc-600 focus:bg-[#16161c] focus-visible:border-[#22c55e] transition-all"
            />
          </div>

          <div className="inline-flex p-0.5 bg-[#121216] rounded-xs border border-white/[0.08] text-xs font-mono">
            {["All", "Active", "Suspended"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer uppercase tracking-wider text-[11px] ${statusFilter === tab
                    ? "bg-[#22c55e] !text-black font-black shadow-xs"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-white/[0.08] rounded-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#121217] text-zinc-400 font-mono border-b border-white/[0.08] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Contact Phone</th>
              <th className="py-3 px-4">Plan Access</th>
              <th className="py-3 px-4">Enrolled Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-[#22c55e]" />
                    <span>Loading verified member records...</span>
                  </div>
                </td>
              </tr>
            ) : members.length > 0 ? (
              members.map((user) => {
                const activeSub = user.subscriptions?.find((s) => s.status === "ACTIVE");
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-xs border border-white/[0.1]">
                          {user.photoUrl && <AvatarImage src={user.photoUrl} />}
                          <AvatarFallback className="rounded-xs bg-[#22c55e]/10 text-[#22c55e] font-bold text-xs font-mono">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold text-white block">
                            {user.name}
                          </span>
                          <span className="text-zinc-500 text-xs block font-mono">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3.5 px-4 text-zinc-300 text-xs font-mono">
                      {user.phone || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {activeSub ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-xs font-mono text-[11px] font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                          {activeSub.planName}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-xs">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-xs font-mono">
                      {joinedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xs w-44 shadow-2xl bg-[#121217] border border-white/[0.1] text-white text-xs font-sans"
                        >
                          <DropdownMenuLabel className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                            Moderation Controls
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => toast.info(`Viewing profile for ${user.name}`)}
                            className="cursor-pointer text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                          >
                            <UserCheck size={14} className="mr-2 text-zinc-400" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/[0.06]" />
                          {user.status === "ACTIVE" ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user.id, "SUSPENDED")}
                              className="cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-white/[0.04]"
                            >
                              <UserX size={14} className="mr-2" />
                              Suspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user.id, "ACTIVE")}
                              className="cursor-pointer text-[#22c55e] hover:text-[#16a34a] hover:bg-white/[0.04]"
                            >
                              <CheckCircle size={14} className="mr-2" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 font-mono text-xs">
                  No member records found matching filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 mt-2 text-xs font-mono text-zinc-400">
        <span>
          Showing {members.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} accounts
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
            className="h-8 px-2.5 rounded-sm border-white/[0.1] bg-white/[0.02] text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-white/[0.08] disabled:opacity-40"
          >
            <ChevronLeft size={14} className="mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={pagination.page >= pagination.pages}
            className="h-8 px-2.5 rounded-sm border-white/[0.1] bg-white/[0.02] text-white text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-white/[0.08] disabled:opacity-40"
          >
            Next
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
