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
      change: "+100%",
      isPositive: true,
      period: "current active roster",
      icon: Users,
      accentColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      progressPercent: Math.min(100, Math.max(20, activeMembers * 10)),
    },
    {
      id: "monthly-revenue",
      title: "30-Day Revenue (BDT)",
      value: isLoading ? "..." : `৳${monthlyRevenueBdt.toLocaleString("en-US")}`,
      change: "+15.2%",
      isPositive: true,
      period: "verified collections",
      icon: CreditCard,
      accentColor: "bg-blue-50 text-blue-600 border-blue-200",
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
      accentColor: "bg-purple-50 text-purple-600 border-purple-200",
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
      accentColor: "bg-amber-50 text-amber-600 border-amber-200",
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
            className="bg-white p-5 rounded-xs border border-gray-200/80 shadow-xs hover:shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  {stat.title}
                </span>
                <div
                  className={`p-2 rounded-xs border ${stat.accentColor}`}
                >
                  <IconComponent size={18} />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span
                  className={`inline-flex items-center font-semibold ${stat.isPositive ? "text-emerald-600" : "text-amber-600"
                    }`}
                >
                  <ArrowUpRight size={14} className="mr-0.5" />
                  {stat.change}
                </span>
                <span className="text-gray-400">{stat.period}</span>
              </div>

              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stat.isPositive ? "bg-[#22c55e]" : "bg-amber-400"
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
