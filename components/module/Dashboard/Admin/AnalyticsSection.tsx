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
      <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Growth & Activity Trends
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-xs border border-emerald-200">
                +24.8% YoY
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Monthly overview of newly registered members vs active sessions
            </p>
          </div>

          <div className="inline-flex p-0.5 bg-gray-100 rounded-xs border border-gray-200 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Signups
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                activeTab === "sessions"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
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
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
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
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x="30"
                      y={yPos + 4}
                      fill="#94a3b8"
                      fontSize="10"
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
                stroke="#10b981"
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
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-150"
                  />
                  <text
                    x={pt.x}
                    y="245"
                    fill="#64748b"
                    fontSize="11"
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
      <div className="bg-white p-5 sm:p-6 rounded-xs border border-gray-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              User Distribution
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Info size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Breakdown by user roles and platform privileges
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
                stroke="#f1f5f9"
                strokeWidth="3.5"
              />
              {/* Registered Users (75%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#10b981"
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
                stroke="#8b5cf6"
                strokeWidth="3.5"
                strokeDasharray="7, 100"
                strokeDashoffset="-93"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold text-gray-900">14.8k</span>
              <span className="block text-[11px] text-gray-500 font-medium">
                Total Accounts
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-700 font-medium">Standard Users</span>
            </div>
            <span className="text-gray-900 font-semibold">75% (11,169)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-700 font-medium">Staff & Managers</span>
            </div>
            <span className="text-gray-900 font-semibold">18% (2,680)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-gray-700 font-medium">Super Admins</span>
            </div>
            <span className="text-gray-900 font-semibold">7% (1,043)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
