"use client";

import { motion } from "framer-motion";
import { ChevronDown, Info, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState<"users" | "sessions">("users");

  // Monthly data points for area curve
  const dataPoints = [
    { month: "Jan", users: 1200, sessions: 2800 },
    { month: "Feb", users: 1850, sessions: 3900 },
    { month: "Mar", users: 2400, sessions: 4800 },
    { month: "Apr", users: 2100, sessions: 4300 },
    { month: "May", users: 3200, sessions: 6200 },
    { month: "Jun", users: 4100, sessions: 7800 },
    { month: "Jul", users: 3800, sessions: 7100 },
    { month: "Aug", users: 5200, sessions: 9400 },
    { month: "Sep", users: 6100, sessions: 11200 },
    { month: "Oct", users: 5900, sessions: 10800 },
    { month: "Nov", users: 7400, sessions: 13500 },
    { month: "Dec", users: 8900, sessions: 15800 },
  ];

  const maxVal = activeTab === "users" ? 10000 : 18000;

  // Generate SVG path for smooth line chart
  const points = dataPoints.map((item, idx) => {
    const x = (idx / (dataPoints.length - 1)) * 680 + 40;
    const val = activeTab === "users" ? item.users : item.sessions;
    const y = 200 - (val / maxVal) * 160 + 20;
    return { x, y, ...item };
  });

  const linePath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} 230 L ${
    points[0].x
  } 230 Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Growth Area Chart (2 cols) */}
      <div className="lg:col-span-2 bg-[#0e0e12] p-5 sm:p-6 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Activity & Growth Telemetry
              </h2>
              <span className="bg-[#22c55e]/10 text-[#22c55e] text-xs font-mono font-bold px-2 py-0.5 rounded-xs border border-[#22c55e]/30">
                +24.8% YoY
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Monthly overview of newly registered members vs active workout sessions
            </p>
          </div>

          <div className="inline-flex p-0.5 bg-[#121216] rounded-xs border border-white/[0.08] text-xs font-mono self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                activeTab === "users"
                  ? "bg-[#22c55e] !text-black font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Signups
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
                activeTab === "sessions"
                  ? "bg-[#22c55e] !text-black font-black shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sessions
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-[250px] relative">
            <svg
              viewBox="0 0 760 250"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              {[0, 1, 2, 3, 4].map((gridIndex) => {
                const yPos = 40 + gridIndex * 45;
                const labelVal = Math.round(
                  maxVal - (gridIndex / 4) * maxVal
                ).toLocaleString();
                return (
                  <g key={gridIndex}>
                    <line
                      x1="40"
                      y1={yPos}
                      x2="720"
                      y2={yPos}
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x="30"
                      y={yPos + 4}
                      fill="#71717a"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={areaPath}
                fill="url(#chartGradient)"
              />

              {/* Stroke Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                d={linePath}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#0e0e12"
                    stroke="#22c55e"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-150"
                  />
                  <text
                    x={pt.x}
                    y="245"
                    fill="#a1a1aa"
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Role & Demographics Donut Card (1 col) */}
      <div className="bg-[#0e0e12] p-5 sm:p-6 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between text-white">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              Account Demographics
            </h2>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Info size={16} />
            </button>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Roster distribution by permissions and roles
          </p>
        </div>

        {/* Visual Donut / Breakdown */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="3.5"
              />
              {/* Registered Users (75%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeDasharray="75, 100"
                strokeDashoffset="0"
              />
              {/* Managers (18%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeDasharray="18, 100"
                strokeDashoffset="-75"
              />
              {/* Admins (7%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.5"
                strokeDasharray="7, 100"
                strokeDashoffset="-93"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-white font-mono block">14.8k</span>
              <span className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                Total Roster
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 pt-3 border-t border-white/[0.06] text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-zinc-300">Standard Members</span>
            </div>
            <span className="text-white font-bold">75% (11,169)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-zinc-300">Coaches & Trainers</span>
            </div>
            <span className="text-white font-bold">18% (2,680)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-zinc-300">Super Admins</span>
            </div>
            <span className="text-white font-bold">7% (1,043)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
