"use client";

import AppSidebar from "@/components/shared/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, ChevronRight, Home, Search } from "lucide-react";
import Link from "next/link";

import { useAppSelector } from "@/redux/hooks";
import { useDecodedToken } from "@/src/hooks/useDecodedToken";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);
  const decodedToken = useDecodedToken(token);
  const role = decodedToken?.role || "ADMIN";

  return (
    <SidebarProvider>
      {/* Pass the user role dynamically to AppSidebar */}
      <AppSidebar role={role} />
      <SidebarInset className="bg-[#0b0b0d] text-white min-h-screen">
        {/* Modern Top Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0b0b0d]/90 px-4 sm:px-6 backdrop-blur-md transition-all">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white rounded-xs" />
            <div className="h-4 w-[1px] bg-white/[0.1]" />
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Link
                href="/admin/dashboard"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home size={13} className="text-[#22c55e]" />
                <span className="font-mono">PORTAL</span>
              </Link>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-white font-mono font-bold uppercase tracking-wider">{role} WORKSPACE</span>
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-xs border border-white/[0.08] text-xs text-zinc-400 cursor-pointer transition-colors">
              <Search size={14} className="text-zinc-400" />
              <span className="font-sans">Search records...</span>
              <kbd className="ml-2 font-mono text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded-xs border border-white/[0.08] text-zinc-300">
                ⌘K
              </kbd>
            </div>

            {/* Notification Bell */}
            <button
              title="Notifications"
              className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-sm transition-colors cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22c55e] ring-2 ring-[#0b0b0d]" />
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] bg-[#0b0b0d]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

