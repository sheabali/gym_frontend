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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-gray-200">
                {user?.photoUrl && (
                  <AvatarImage
                    src={user.photoUrl}
                    alt={displayName}
                    className="h-8 w-8 object-cover rounded-lg"
                  />
                )}
                <AvatarFallback className="rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                  {initials || "PG"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-900">
                  {displayName}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {displayEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm border-b border-gray-100">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user?.photoUrl && (
                    <AvatarImage
                      src={user.photoUrl}
                      alt={displayName}
                      className="h-8 w-8 object-cover rounded-lg"
                    />
                  )}
                  <AvatarFallback className="rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                    {initials || "PG"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
