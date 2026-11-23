/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname, useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  const { data: response, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  }) as any;

  const user = response?.data || response;

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch {
      // ignore network errors on logout
    }
    dispatch(logout());
    router.push("/login?redirect=" + encodeURIComponent(pathname));
  };

  const displayName = user?.name || "Member";
  const displayEmail = user?.email || "Signed in";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-gray-500">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-white/[0.08] hover:bg-white/[0.04] text-white cursor-pointer rounded-xs"
            >
              <Avatar className="h-8 w-8 rounded-xs border border-white/[0.1]">
                {user?.photoUrl && (
                  <AvatarImage
                    src={user.photoUrl}
                    alt={displayName}
                    className="h-8 w-8 object-cover rounded-xs"
                  />
                )}
                <AvatarFallback className="rounded-xs bg-[#22c55e]/10 text-[#22c55e] font-bold text-xs font-mono">
                  {initials || "PG"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight font-sans">
                <span className="truncate font-bold text-white">
                  {displayName}
                </span>
                <span className="truncate text-[11px] text-zinc-400 font-mono">
                  {displayEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-zinc-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xs bg-[#121217] border border-white/[0.1] text-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-3 py-2.5 text-left text-xs border-b border-white/[0.06]">
                <Avatar className="h-8 w-8 rounded-xs border border-white/[0.1]">
                  {user?.photoUrl && (
                    <AvatarImage
                      src={user.photoUrl}
                      alt={displayName}
                      className="h-8 w-8 object-cover rounded-xs"
                    />
                  )}
                  <AvatarFallback className="rounded-xs bg-[#22c55e]/10 text-[#22c55e] font-bold text-xs font-mono">
                    {initials || "PG"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight font-sans">
                  <span className="truncate font-bold text-white">
                    {displayName}
                  </span>
                  <span className="truncate text-[11px] text-zinc-400 font-mono">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-white/[0.04] text-xs font-mono py-2">
              <LogOut className="mr-2 h-4 w-4" />
              TERMINATE SESSION (SIGN OUT)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
