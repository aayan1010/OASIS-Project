"use client";

import { useState } from "react";
import TopOverview from "../../components/feature/TopOverview";
import {
  dashboardKpiData,
  quickActions,
  sectorOverview,
  recentAlerts,
} from "../../mocks/dashboard";

export default function OverviewPage() {
  const [kpis, setKpis] = useState(dashboardKpiData);
  const [activeSector, setActiveSector] = useState("oil");

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  const handleQuickAction = (id: string) => {
    // Placeholder for quick action handlers
    console.log("[v0] Quick action:", id);
  };

  return (
    <>
      <TopOverview
        title="Overview"
        subtitle="Real-time oil & gas KPIs, alerts, and system health across all operations"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={quickActions.map((a) => ({
          ...a,
          onClick: () => handleQuickAction(a.id),
        }))}
      />

      <div className="px-6 py-6">
        {/* Sector Overview Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-heading font-semibold text-foreground-900 mb-4">
            Operations Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectorOverview.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`text-left rounded-lg border p-4 transition-all hover:shadow-md ${
                  activeSector === sector.id
                    ? "border-primary-300 bg-primary-50/50"
                    : "border-background-200/70 bg-background-50 hover:border-background-300/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground-800">
                    {sector.name}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      sector.active ? "bg-primary-500" : "bg-foreground-300"
                    }`}
                  ></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-500">Sites</span>
                    <span className="font-medium text-foreground-800">
                      {sector.sites}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-500">Assets</span>
                    <span className="font-medium text-foreground-800">
                      {sector.assets}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-500">Health</span>
                    <span
                      className={`font-medium ${
                        sector.health >= 95
                          ? "text-primary-600"
                          : sector.health >= 85
                            ? "text-foreground-700"
                            : "text-accent-600"
                      }`}
                    >
                      {sector.health}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-500">Production</span>
                    <span className="font-medium text-foreground-800">
                      {sector.production}
                    </span>
                  </div>
                  {sector.alerts > 0 && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-background-200/70">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-alarm-warning-line text-xs text-accent-500"></i>
                      </div>
                      <span className="text-xs text-accent-600 font-medium">
                        {sector.alerts} active alerts
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Alerts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Alerts */}
          <div className="lg:col-span-2 bg-background-50 rounded-lg border border-background-200/70 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
              <h3 className="text-sm font-semibold text-foreground-900">
                Active Alerts
              </h3>
              <span className="text-xs text-accent-600 font-medium bg-accent-50 px-2 py-1 rounded-full">
                {recentAlerts.filter((a) => a.status === "active").length} active
              </span>
            </div>
            <div className="divide-y divide-background-100">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-background-100 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.severity === "high"
                        ? "bg-accent-500"
                        : alert.severity === "medium"
                          ? "bg-accent-300"
                          : "bg-primary-300"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground-800 truncate">
                      {alert.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-foreground-400">
                        {alert.module}
                      </span>
                      <span className="text-xs text-foreground-300">
                        {alert.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                      alert.status === "active"
                        ? "bg-accent-100 text-accent-700"
                        : "bg-background-200 text-foreground-500"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status & Quick Stats */}
          <div className="space-y-4">
            <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
              <h3 className="text-sm font-semibold text-foreground-900 mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground-500">
                      Uptime
                    </span>
                    <span className="text-xs font-medium text-foreground-800">
                      99.97%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: "99.97%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground-500">
                      Data Pipeline
                    </span>
                    <span className="text-xs font-medium text-primary-600">
                      Healthy
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground-500">
                      API Response
                    </span>
                    <span className="text-xs font-medium text-foreground-800">
                      42ms
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground-500">
                      Storage
                    </span>
                    <span className="text-xs font-medium text-foreground-800">
                      67%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-500 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
              <h3 className="text-sm font-semibold text-foreground-900 mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-primary-600 mb-1">
                    <i className="ri-building-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    10
                  </p>
                  <p className="text-xs text-foreground-500">Active Sites</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-secondary-600 mb-1">
                    <i className="ri-cpu-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    332
                  </p>
                  <p className="text-xs text-foreground-500">Total Assets</p>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-accent-600 mb-1">
                    <i className="ri-team-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    48
                  </p>
                  <p className="text-xs text-foreground-500">Active Crews</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-primary-600 mb-1">
                    <i className="ri-check-double-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    156
                  </p>
                  <p className="text-xs text-foreground-500">Completed Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
