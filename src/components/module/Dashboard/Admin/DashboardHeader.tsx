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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Admin Command Deck
          </h1>
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-xs transition-all cursor-pointer"
          >
            <RefreshCw
              size={16}
              className={`${isRefreshing ? "animate-spin text-[#22c55e]" : ""}`}
            />
          </button>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-sans">
          Platform telemetry, real-time subscriber metrics, and administrative oversight.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <div className="inline-flex items-center p-0.5 bg-[#121216] rounded-xs border border-white/[0.08] text-xs font-mono">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-2.5 py-1.5 rounded-xs transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                selectedRange === range
                  ? "bg-[#22c55e] !text-black font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
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
          className="h-9 gap-1.5 rounded-xs border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider cursor-pointer"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </Button>

        <Button
          size="sm"
          className="h-9 gap-1.5 rounded-xs font-mono uppercase tracking-wider font-black text-xs cursor-pointer bg-[#22c55e] hover:bg-[#16a34a] !text-black shadow-md shadow-[#22c55e]/20"
          onClick={() => toast.info("Add Member modal opening...")}
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Add Member</span>
        </Button>
      </div>
    </div>
  );
}
