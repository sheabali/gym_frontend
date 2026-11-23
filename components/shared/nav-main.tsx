"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      icon?: LucideIcon;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1 px-2">
        {items?.map((item) => {
          const isActive = item.isActive || pathname === item.url;

          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`text-xs font-mono uppercase tracking-wider transition-all rounded-xs py-2.5 ${
                        isActive
                          ? "bg-white/[0.06] text-[#22c55e] border-l-2 border-[#22c55e] font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} className="rounded-xs">
                              {subItem.icon && (
                                <subItem.icon className="mr-2 h-4 w-4" />
                              )}
                              <span
                                className={`text-xs font-mono uppercase tracking-wider ${
                                  pathname === subItem.url ? "text-[#22c55e] font-bold" : "text-zinc-400"
                                }`}
                              >
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // If no sub-items, render as a simple link
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`text-xs font-mono uppercase tracking-wider transition-all rounded-xs py-2.5 ${
                  isActive
                    ? "bg-white/[0.06] text-[#22c55e] border-l-2 border-[#22c55e] font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className={`mr-2 h-4 w-4 ${isActive ? "text-[#22c55e]" : "text-zinc-400"}`} />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
