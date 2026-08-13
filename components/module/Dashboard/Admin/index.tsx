"use client";

import AnalyticsSection from "./AnalyticsSection";
import DashboardHeader from "./DashboardHeader";
import RecentActivityFeed from "./RecentActivityFeed";
import RecentUsersTable from "./RecentUsersTable";
import StatsGrid from "./StatsGrid";

export default function AdminDashboardModule() {
  return (
    <div className="space-y-6 container mx-auto py-2">
      {/* 1. Header & Quick Controls */}
      <DashboardHeader />

      {/* 2. Key Metric KPI Cards */}
      <StatsGrid />

      {/* 3. Analytics & Growth Visualizations */}
      <AnalyticsSection />

      {/* 4. Tables & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentUsersTable />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
}
