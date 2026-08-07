"use client";

import { useState, useEffect, useMemo } from "react";
import TopOverview from "../../components/feature/TopOverview";
import type { AlertThreshold } from "../../components/feature/ThresholdSettings";
import { useThresholdAlerts } from "../../hooks/ThresholdAlertContext";
import ProductionChart from "../../pages/production/components/ProductionChart";
import ThroughputCards from "../../pages/production/components/ThroughputCards";
import YieldComparison from "../../pages/production/components/YieldComparison";
import DowntimeLog from "../../pages/production/components/DowntimeLog";
import BudgetChart from "../../pages/finance/components/BudgetChart";
import OpexBreakdown from "../../pages/finance/components/OpexBreakdown";
import RevenueStreams from "../../pages/finance/components/RevenueStreams";
import CostMetrics from "../../pages/finance/components/CostMetrics";
import UpdatePlanModal from "../../pages/performance/components/UpdatePlanModal";
import LogOutputModal from "../../pages/performance/components/LogOutputModal";
import ExportReportModal from "../../pages/overview/components/ExportReportModal";
import {
  useLatestProductionPlan,
  useProductionRecords,
  useRevenueStreams,
  useMonthlyBudget,
  useCostPerUnit,
  useScheduleAdherence,
  type ProductionPlanRecord,
} from "../../lib/api";

const defaultThresholds: Record<string, AlertThreshold> = {
  "daily-output": { warning: 10000, critical: 8000, direction: "below", enabled: true },
  "revenue-mtd": { warning: 3000000, critical: 2500000, direction: "below", enabled: true },
  "yield-vs-target": { warning: 92, critical: 85, direction: "below", enabled: true },
  "opex-mtd": { warning: 1500000, critical: 1800000, direction: "above", enabled: false },
  "downtime-hours": { warning: 8, critical: 12, direction: "above", enabled: true },
  "budget-vs-actual": { warning: 95, critical: 90, direction: "below", enabled: false },
  "schedule-adherence": { warning: 88, critical: 80, direction: "below", enabled: true },
  "cost-per-unit": { warning: 55, critical: 65, direction: "above", enabled: false },
};

interface PerformanceKpi {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  color: "primary" | "accent" | "secondary";
  pinned: boolean;
  thresholds: AlertThreshold;
}



const performanceActions = [
  { id: "update-plan", label: "Update Plan", icon: "ri-edit-line", color: "primary" as const },
  { id: "log-output", label: "Log Output", icon: "ri-add-circle-line", color: "primary" as const },
  { id: "export-data", label: "Export Data", icon: "ri-download-line", color: "secondary" as const },
];

function toDateStr(d: unknown): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (typeof d === "object" && "_seconds" in (d as object))
    return new Date((d as { _seconds: number })._seconds * 1000).toISOString().slice(0, 10);
  return String(d);
}

export default function PerformancePage() {
  const { data: productionRecords } = useProductionRecords();
  const { data: revenueStreams } = useRevenueStreams();
  const { data: monthlyBudget } = useMonthlyBudget();
  const { data: costPerUnit } = useCostPerUnit();
  const { data: scheduleAdherence } = useScheduleAdherence();

  // Latest day's production totals.
  const { dailyOutput, avgEfficiency, latestDowntime } = useMemo(() => {
    const sorted = [...productionRecords].sort((a, b) => toDateStr(b.date).localeCompare(toDateStr(a.date)));
    const latestDate = toDateStr(sorted[0]?.date);
    const latest = latestDate ? sorted.filter((r) => toDateStr(r.date) === latestDate) : [];
    if (!latest.length) return { dailyOutput: null, avgEfficiency: null, latestDowntime: null };
    return {
      dailyOutput: Math.round(latest.reduce((s, r) => s + (r.actual_production ?? 0), 0)),
      avgEfficiency: Math.round(latest.reduce((s, r) => s + (r.efficiency_percentage ?? 0), 0) / latest.length * 10) / 10,
      latestDowntime: Math.round(latest.reduce((s, r) => s + (r.downtime_hours ?? 0), 0) * 10) / 10,
    };
  }, [productionRecords]);

  const totalRevenue = useMemo(() => revenueStreams.reduce((s, r) => s + r.amount, 0), [revenueStreams]);
  const totalOpex = useMemo(() => monthlyBudget.reduce((s, r) => s + (r.actual ?? r.budget ?? 0), 0), [monthlyBudget]);
  const totalBudget = useMemo(() => monthlyBudget.reduce((s, r) => s + (r.budget ?? 0), 0), [monthlyBudget]);
  const budgetPct = totalBudget > 0 ? Math.round((totalOpex / totalBudget) * 1000) / 10 : null;
  const latestCpu = costPerUnit.length ? costPerUnit[costPerUnit.length - 1] : null;
  const avgAdherence = scheduleAdherence.length
    ? Math.round(scheduleAdherence.reduce((s, r) => s + r.adherence, 0) / scheduleAdherence.length)
    : null;

  const liveKpis = useMemo((): PerformanceKpi[] => [
    {
      id: "daily-output",
      title: "Daily Output",
      value: dailyOutput !== null ? dailyOutput.toLocaleString() : "12,450",
      unit: "bbl/day",
      change: "+2.1%",
      changeType: "positive",
      icon: "ri-drop-line",
      color: "primary",
      pinned: true,
      thresholds: defaultThresholds["daily-output"],
    },
    {
      id: "revenue-mtd",
      title: "Revenue (MTD)",
      value: totalRevenue > 0 ? `$${(totalRevenue / 1_000_000).toFixed(1)}M` : "$3.8M",
      change: "+4.1%",
      changeType: "positive",
      icon: "ri-line-chart-line",
      color: "secondary",
      pinned: true,
      thresholds: defaultThresholds["revenue-mtd"],
    },
    {
      id: "yield-vs-target",
      title: "Yield vs Target",
      value: avgEfficiency !== null ? `${avgEfficiency}%` : "97.2%",
      change: "+0.8%",
      changeType: "positive",
      icon: "ri-percent-line",
      color: "primary",
      pinned: true,
      thresholds: defaultThresholds["yield-vs-target"],
    },
    {
      id: "opex-mtd",
      title: "OPEX (MTD)",
      value: totalOpex > 0 ? `$${(totalOpex / 1_000_000).toFixed(2)}M` : "$1.24M",
      change: "-2.3%",
      changeType: "positive",
      icon: "ri-money-dollar-circle-line",
      color: "primary",
      pinned: true,
      thresholds: defaultThresholds["opex-mtd"],
    },
    {
      id: "downtime-hours",
      title: "Downtime Hours",
      value: latestDowntime !== null ? String(latestDowntime) : "4.5",
      unit: "hrs",
      change: "-1.2",
      changeType: "positive",
      icon: "ri-time-line",
      color: "accent",
      pinned: false,
      thresholds: defaultThresholds["downtime-hours"],
    },
    {
      id: "budget-vs-actual",
      title: "Budget vs Actual",
      value: budgetPct !== null ? `${budgetPct}%` : "97.7%",
      change: budgetPct !== null && budgetPct < 100 ? "Under budget" : "Over budget",
      changeType: budgetPct !== null && budgetPct < 100 ? "positive" : "negative",
      icon: "ri-pie-chart-line",
      color: "primary",
      pinned: false,
      thresholds: defaultThresholds["budget-vs-actual"],
    },
    {
      id: "schedule-adherence",
      title: "Schedule Adherence",
      value: avgAdherence !== null ? `${avgAdherence}%` : "94%",
      change: "+3%",
      changeType: "positive",
      icon: "ri-calendar-check-line",
      color: "secondary",
      pinned: false,
      thresholds: defaultThresholds["schedule-adherence"],
    },
    {
      id: "cost-per-unit",
      title: "Cost Per Unit",
      value: latestCpu ? `$${latestCpu.cost.toFixed(2)}` : "$42.50",
      change: "-1.2%",
      changeType: "positive",
      icon: "ri-price-tag-3-line",
      color: "secondary",
      pinned: false,
      thresholds: defaultThresholds["cost-per-unit"],
    },
  ], [dailyOutput, totalRevenue, avgEfficiency, totalOpex, latestDowntime, budgetPct, avgAdherence, latestCpu]);

  const [kpiOverrides, setKpiOverrides] = useState<Record<string, Partial<PerformanceKpi>>>({});
  const kpis: PerformanceKpi[] = liveKpis.map((k) => ({ ...k, ...kpiOverrides[k.id] }));
  const setKpis = (updater: PerformanceKpi[] | ((prev: PerformanceKpi[]) => PerformanceKpi[])) => {
    const next = typeof updater === "function" ? updater(kpis) : updater;
    setKpiOverrides(next.reduce<Record<string, Partial<PerformanceKpi>>>((acc, k) => {
      acc[k.id] = { pinned: k.pinned, thresholds: k.thresholds };
      return acc;
    }, {}));
  };

  const [viewMode, setViewMode] = useState("production");
  const { syncPageKpis, clearPageKpis } = useThresholdAlerts();
  const [showUpdatePlan, setShowUpdatePlan] = useState(false);
  const [showLogOutput, setShowLogOutput] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  // Latest plan is fetched from Firestore; revalidate after a new save.
  const { data: savedPlan, revalidate: revalidatePlan } = useLatestProductionPlan();
  // Allow temporarily hiding the plan card without deleting from Firestore.
  const [planHidden, setPlanHidden] = useState(false);

  useEffect(() => {
    syncPageKpis("performance", kpis);
    return () => clearPageKpis("performance");
  }, [kpis, syncPageKpis, clearPageKpis]);

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  const handleThresholdsChange = (id: string, t: AlertThreshold) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, thresholds: t } : k))
    );
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "update-plan":
        setShowUpdatePlan(true);
        break;
      case "log-output":
        setShowLogOutput(true);
        break;
      case "export-data":
        setShowExportData(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TopOverview
        title="Performance"
        subtitle="Production output, throughput analytics, and financial performance metrics"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        onThresholdsChange={handleThresholdsChange}
        quickActions={performanceActions.map((a) => ({
          ...a,
          onClick: () => handleQuickAction(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "production", label: "Production Output", icon: "ri-drop-line" },
            { id: "financial", label: "Financial Performance", icon: "ri-line-chart-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "production" ? (
          <div className="space-y-4">
            {savedPlan && !planHidden && (
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
                      <i className="ri-file-list-3-line text-primary-600 text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-heading font-semibold text-foreground-900">
                        Current Production Plan
                      </h3>
                      <p className="text-xs text-foreground-500">
                        {savedPlan.siteName} ({savedPlan.siteId})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground-400 bg-background-100 rounded-full px-3 py-1">
                      {savedPlan.effectiveFrom} → {savedPlan.effectiveTo}
                    </span>
                    <button
                      onClick={() => setPlanHidden(true)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors"
                      title="Hide plan"
                    >
                      <i className="ri-close-line text-sm"></i>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-background-100/70 rounded-md p-3">
                    <p className="text-xs text-foreground-500 mb-1">Target Daily Output</p>
                    <p className="text-lg font-heading font-semibold text-foreground-900">
                      {savedPlan.targetOutput.toLocaleString()} <span className="text-sm font-normal text-foreground-500">bbl/day</span>
                    </p>
                  </div>
                  <div className="bg-background-100/70 rounded-md p-3">
                    <p className="text-xs text-foreground-500 mb-1">Target Efficiency</p>
                    <p className="text-lg font-heading font-semibold text-foreground-900">
                      {savedPlan.targetEfficiency} <span className="text-sm font-normal text-foreground-500">%</span>
                    </p>
                  </div>
                  <div className="bg-background-100/70 rounded-md p-3">
                    <p className="text-xs text-foreground-500 mb-1">Plan Period</p>
                    <p className="text-sm font-heading font-semibold text-foreground-900">
                      {savedPlan.effectiveFrom} — {savedPlan.effectiveTo}
                    </p>
                    <p className="text-xs text-foreground-400 mt-0.5">
                      {(() => {
                        const from = new Date(savedPlan.effectiveFrom);
                        const to = new Date(savedPlan.effectiveTo);
                        const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                        return `${diff} days`;
                      })()}
                    </p>
                  </div>
                </div>
                {savedPlan.notes && (
                  <div className="mt-3 pt-3 border-t border-background-200/60">
                    <p className="text-xs text-foreground-500 mb-1">Notes</p>
                    <p className="text-sm text-foreground-700">{savedPlan.notes}</p>
                  </div>
                )}
              </div>
            )}
            <ProductionChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <YieldComparison />
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
                <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">
                  Schedule Adherence by Shift
                </h3>
                <div className="space-y-4">
                  {scheduleAdherence.map((shift) => (
                    <div key={shift.shift}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-foreground-700">{shift.shift}</span>
                        <span className="text-xs font-medium text-foreground-600">
                          {shift.adherence}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-background-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            shift.adherence >= 95 ? "bg-primary-500" : "bg-amber-500"
                          }`}
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
            <ThroughputCards />
            <DowntimeLog />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BudgetChart />
              <OpexBreakdown />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {revenueStreams.slice(0, 4).map((stream) => (
                <div
                  key={stream.stream}
                  className="bg-background-50 rounded-lg border border-background-200/70 p-4"
                >
                  <p className="text-xs text-foreground-500 mb-1">{stream.stream}</p>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    ${(stream.amount / 1000000).toFixed(2)}M
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      stream.growth.startsWith("+") ? "text-emerald-600" : "text-accent-600"
                    }`}
                  >
                    {stream.growth} vs last month
                  </p>
                </div>
              ))}
            </div>
            <RevenueStreams />
            <CostMetrics />
          </div>
        )}
      </div>

      <UpdatePlanModal
        open={showUpdatePlan}
        onClose={() => setShowUpdatePlan(false)}
        currentPlan={savedPlan}
        onSave={(_plan: ProductionPlanRecord) => {
          setPlanHidden(false);
          revalidatePlan();
        }}
      />
      <LogOutputModal
        open={showLogOutput}
        onClose={() => setShowLogOutput(false)}
      />
      <ExportReportModal
        open={showExportData}
        onClose={() => setShowExportData(false)}
      />
    </>
  );
}
