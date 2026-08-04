"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import ProductionChart from "./components/ProductionChart";
import ThroughputCards from "./components/ThroughputCards";
import YieldComparison from "./components/YieldComparison";
import DowntimeLog from "./components/DowntimeLog";
import { totalDailyProduction, avgEfficiency, totalDowntime } from "../../mocks/production";
import { useScheduleAdherence } from "../../lib/api";

const productionKpis = [
  {
    id: "daily-output",
    title: "Daily Output",
    value: totalDailyProduction.toLocaleString(),
    unit: "bbl/day",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: "ri-drop-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "yield-vs-target",
    title: "Avg Efficiency",
    value: `${avgEfficiency}%`,
    change: "+0.8%",
    changeType: "positive" as const,
    icon: "ri-percent-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "downtime-hours",
    title: "Downtime (Jul MTD)",
    value: String(totalDowntime),
    unit: "hrs",
    change: "-1.2",
    changeType: "positive" as const,
    icon: "ri-time-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "schedule-adherence",
    title: "Schedule Adherence",
    value: "94%",
    change: "+3%",
    changeType: "positive" as const,
    icon: "ri-calendar-check-line",
    color: "secondary" as const,
    pinned: true,
  },
  {
    id: "efficiency-rate",
    title: "Efficiency Rate",
    value: `${avgEfficiency}%`,
    change: "+2%",
    changeType: "positive" as const,
    icon: "ri-speed-line",
    color: "secondary" as const,
    pinned: false,
  },
  {
    id: "quality-score",
    title: "Quality Score",
    value: "99.1%",
    change: "+0.2%",
    changeType: "positive" as const,
    icon: "ri-award-line",
    color: "primary" as const,
    pinned: false,
  },
];

const productionActions = [
  { id: "update-plan", label: "Update Plan", icon: "ri-edit-line", color: "primary" as const },
  { id: "log-output", label: "Log Output", icon: "ri-add-circle-line", color: "primary" as const },
  { id: "view-forecasts", label: "View Forecasts", icon: "ri-line-chart-line", color: "secondary" as const },
];

export default function ProductionPage() {
  const { data: scheduleAdherence } = useScheduleAdherence();
  const [kpis, setKpis] = useState(productionKpis);
  const [viewMode, setViewMode] = useState("charts");

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  return (
    <>
      <TopOverview
        title="Production"
        subtitle="Production metrics, throughput tracking, and schedule management"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={productionActions.map((a) => ({
          ...a,
          onClick: () => console.log(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "charts", label: "Production Charts", icon: "ri-line-chart-line" },
            { id: "throughput", label: "Throughput Analytics", icon: "ri-speed-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "charts" ? (
          <div className="space-y-4">
            <ProductionChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <YieldComparison />
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
                <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Schedule Adherence by Shift</h3>
                <div className="space-y-4">
                  {scheduleAdherence.map((shift) => (
                    <div key={shift.shift}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-foreground-700">{shift.shift}</span>
                        <span className="text-xs font-medium text-foreground-600">{shift.adherence}%</span>
                      </div>
                      <div className="w-full h-2 bg-background-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${shift.adherence >= 95 ? "bg-primary-500" : "bg-amber-500"}`}
                          style={{ width: `${shift.adherence}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-foreground-400">
                        <span>Planned: {shift.planned.toLocaleString()} bbl</span>
                        <span>Actual: {shift.actual.toLocaleString()} bbl</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DowntimeLog />
          </div>
        ) : (
          <div className="space-y-4">
            <ThroughputCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <YieldComparison />
              <DowntimeLog />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
