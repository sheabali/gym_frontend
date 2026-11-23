"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Clock,
  CreditCard,
  Users,
} from "lucide-react";
import { useGetAdminOverviewQuery } from "@/redux/api/adminApi";

export default function StatsGrid() {
  const { data: overviewResponse, isLoading } = useGetAdminOverviewQuery(undefined) as any;
  const metrics = overviewResponse?.data;

  const activeMembers = metrics?.activeMembers ?? 0;
  const monthlyRevenueBdt = metrics?.monthlyRevenue ? (metrics.monthlyRevenue / 100) : 0;
  const todaySessions = metrics?.todaySessionsCount ?? 0;
  const pendingPayments = metrics?.pendingPaymentsCount ?? 0;

  const stats = [
    {
      id: "active-members",
      title: "Active Subscribed Members",
      value: isLoading ? "..." : activeMembers.toLocaleString("en-US"),
      change: "Active roster",
      isPositive: true,
      period: "verified members",
      icon: Users,
      accentColor: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30",
      progressPercent: Math.min(100, Math.max(20, activeMembers * 10)),
    },
    {
      id: "monthly-revenue",
      title: "30-Day Revenue (BDT)",
      value: isLoading ? "..." : `৳${monthlyRevenueBdt.toLocaleString("en-US")}`,
      change: "Live collections",
      isPositive: true,
      period: "verified gateway & cash",
      icon: CreditCard,
      accentColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      progressPercent: 85,
    },
    {
      id: "today-sessions",
      title: "Today's Class Sessions",
      value: isLoading ? "..." : todaySessions.toString(),
      change: "On schedule",
      isPositive: true,
      period: "scheduled today",
      icon: Activity,
      accentColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      progressPercent: 75,
    },
    {
      id: "pending-payments",
      title: "Pending Invoices / Verifications",
      value: isLoading ? "..." : pendingPayments.toString(),
      change: pendingPayments > 0 ? "Action needed" : "Clean queue",
      isPositive: pendingPayments === 0,
      period: "cash / gateway pending",
      icon: Clock,
      accentColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      progressPercent: Math.min(100, pendingPayments * 20),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
                  {stat.title}
                </span>
                <div
                  className={`p-2 rounded-xs border ${stat.accentColor}`}
                >
                  <IconComponent size={16} />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                  {stat.value}
                </h3>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center font-bold text-[11px] ${
                    stat.isPositive ? "text-[#22c55e]" : "text-amber-400"
                  }`}
                >
                  <ArrowUpRight size={13} className="mr-0.5" />
                  {stat.change}
                </span>
                <span className="text-zinc-500 text-[10px]">• {stat.period}</span>
              </div>

              <div className="w-16 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stat.isPositive ? "bg-[#22c55e]" : "bg-amber-400"
                  }`}
                  style={{ width: `${stat.progressPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
