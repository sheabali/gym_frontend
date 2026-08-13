"use client";

import {
  AlertCircle,
  CheckCircle2,
  Key,
  ShieldAlert,
  UserPlus,
  Zap,
} from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  type: "success" | "info" | "warning" | "alert";
}

export default function RecentActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: "act-1",
      title: "New admin registered",
      description: "Alexander Wright accepted invitation as Super Admin",
      time: "12 mins ago",
      icon: UserPlus,
      type: "success",
    },
    {
      id: "act-2",
      title: "Password reset request",
      description: "Password reset verified for user sophia.chen@example.com",
      time: "45 mins ago",
      icon: Key,
      type: "info",
    },
    {
      id: "act-3",
      title: "Rate limit triggered",
      description: "High volume of OTP requests detected on IP 192.168.1.42",
      time: "2 hours ago",
      icon: ShieldAlert,
      type: "warning",
    },
    {
      id: "act-4",
      title: "System backup completed",
      description: "Automated daily snapshot saved (2.4 GB)",
      time: "5 hours ago",
      icon: CheckCircle2,
      type: "success",
    },
  ];

  const getIconContainer = (type: ActivityItem["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "info":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "alert":
        return "bg-red-50 text-red-600 border-red-200";
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Audit & Activity Feed
            </h2>
          </div>
          <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
            View All
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Real-time security logs and administrative changes
        </p>

        {/* Timeline */}
        <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="relative flex items-start gap-3.5 pl-0.5 group"
              >
                <div
                  className={`relative z-10 p-1.5 rounded-xs border shadow-xs ${getIconContainer(
                    item.type
                  )} bg-white`}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
