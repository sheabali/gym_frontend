"use client";

import React, { useState } from "react";
import AnalyticsSection from "./AnalyticsSection";
import DashboardHeader from "./DashboardHeader";
import RecentActivityFeed from "./RecentActivityFeed";
import RecentUsersTable from "./RecentUsersTable";
import StatsGrid from "./StatsGrid";
import PlansManager from "./PlansManager";
import ClassesScheduleManager from "./ClassesScheduleManager";
import TrainersManager from "./TrainersManager";
import OfflineCashRecorder from "./OfflineCashRecorder";
import ContactInbox from "./ContactInbox";
import {
  LayoutDashboard,
  Layers,
  Calendar,
  Users,
  Banknote,
  Inbox,
} from "lucide-react";

export default function AdminDashboardModule() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "plans" | "schedule" | "trainers" | "cash" | "inbox"
  >("overview");

  const navTabs = [
    { id: "overview", label: "Executive Overview & Members", icon: LayoutDashboard },
    { id: "plans", label: "Plans Catalog", icon: Layers },
    { id: "schedule", label: "Classes & Schedule", icon: Calendar },
    { id: "trainers", label: "Coaches & Trainers", icon: Users },
    { id: "cash", label: "Cash Desk Register", icon: Banknote },
    { id: "inbox", label: "Contact Inquiries", icon: Inbox },
  ] as const;

  return (
    <div className="space-y-6 container mx-auto py-2">
      {/* 1. Header & Quick Controls */}
      <DashboardHeader />

      {/* 2. Admin Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/60"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Views */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <StatsGrid />

          {/* Analytics & Growth Visualizations */}
          <AnalyticsSection />

          {/* Tables & Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentUsersTable />
            </div>
            <div className="lg:col-span-1">
              <RecentActivityFeed />
            </div>
          </div>
        </div>
      )}

      {activeTab === "plans" && <PlansManager />}

      {activeTab === "schedule" && <ClassesScheduleManager />}

      {activeTab === "trainers" && <TrainersManager />}

      {activeTab === "cash" && <OfflineCashRecorder />}

      {activeTab === "inbox" && <ContactInbox />}
    </div>
  );
}
