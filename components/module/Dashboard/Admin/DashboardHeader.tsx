"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardHeader() {
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const ranges = ["Today", "Last 7 Days", "This Month", "Year to Date"];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard metrics updated");
    }, 600);
  };

  const handleExport = () => {
    toast.success("Exporting report as CSV...");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-gray-200/80">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Overview
          </h1>
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xs transition-all cursor-pointer"
          >
            <RefreshCw
              size={16}
              className={`${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </button>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Monitor your platform growth, active users, and system health in real time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <div className="inline-flex items-center p-0.5 bg-gray-100/90 rounded-xs border border-gray-200 text-xs font-medium">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-2.5 py-1.5 rounded-xs transition-all cursor-pointer ${
                selectedRange === range
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-xs border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
        >
          <Download size={14} />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          className="h-9 gap-1.5 rounded-xs font-medium text-xs cursor-pointer"
          onClick={() => toast.info("Add User modal opening...")}
        >
          <Plus size={14} />
          <span>Add User</span>
        </Button>
      </div>
    </div>
  );
}
