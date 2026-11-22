"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/src/assets/logo.png";
import {
  Home,
  LayoutDashboard,
  Shield,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    navMain: [
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  member: {
    navMain: [
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  trainer: {
    navMain: [
      {
        title: "Trainer Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  admin: {
    navMain: [
      {
        title: "Admin Dashboard",
        url: "/admin/dashboard",
        icon: Shield,
      },
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
};

interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const normalizedRole = role?.toLowerCase();
  const sidebarData = data[normalizedRole as keyof typeof data] || data.user;

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-white border-r border-gray-200"
      {...props}
    >
      <SidebarHeader>
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center p-3"
        >
          <Image
            src={Logo.src}
            alt="Platinum Gym Logo"
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData?.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
