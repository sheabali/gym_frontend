"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  icon: any;
  accentColor: string;
  progressPercent: number;
}

export default function StatsGrid() {
  const stats: StatItem[] = [
    {
      id: "total-users",
      title: "Total Users",
      value: "14,892",
      change: "+12.5%",
      isPositive: true,
      period: "vs last month",
      icon: Users,
      accentColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      progressPercent: 82,
    },
    {
      id: "active-sessions",
      title: "Active Sessions",
      value: "3,420",
      change: "+8.2%",
      isPositive: true,
      period: "vs yesterday",
      icon: Activity,
      accentColor: "bg-blue-50 text-blue-600 border-blue-200",
      progressPercent: 68,
    },
    {
      id: "pending-verifications",
      title: "Pending Verifications",
      value: "34",
      change: "-5.1%",
      isPositive: false,
      period: "backlog queue",
      icon: Clock,
      accentColor: "bg-amber-50 text-amber-600 border-amber-200",
      progressPercent: 35,
    },
    {
      id: "conversion-rate",
      title: "Platform Engagement",
      value: "96.4%",
      change: "+3.2%",
      isPositive: true,
      period: "retention rate",
      icon: TrendingUp,
      accentColor: "bg-purple-50 text-purple-600 border-purple-200",
      progressPercent: 96,
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
                  className={`inline-flex items-center font-semibold ${
                    stat.isPositive ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight size={14} className="mr-0.5" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-0.5" />
                  )}
                  {stat.change}
                </span>
                <span className="text-gray-400">{stat.period}</span>
              </div>

              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stat.isPositive ? "bg-primary" : "bg-amber-400"
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
