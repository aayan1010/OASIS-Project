"use client";

import { useState, useEffect } from "react";
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
import CreateReportModal from "../../pages/performance/components/CreateReportModal";
import ExportReportModal from "../../pages/overview/components/ExportReportModal";
import { scheduleAdherence } from "../../mocks/production";
import { revenueStreams } from "../../mocks/finance";

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

const performanceKpis: PerformanceKpi[] = [
  {
    id: "daily-output",
    title: "Daily Output",
    value: "12,450",
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
    value: "$3.8M",
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
    value: "97.2%",
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
    value: "$1.24M",
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
    value: "4.5",
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
    value: "97.7%",
    change: "Under budget",
    changeType: "positive",
    icon: "ri-pie-chart-line",
    color: "primary",
    pinned: false,
    thresholds: defaultThresholds["budget-vs-actual"],
  },
  {
    id: "schedule-adherence",
    title: "Schedule Adherence",
    value: "94%",
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
    value: "$42.50",
    change: "-1.2%",
    changeType: "positive",
    icon: "ri-price-tag-3-line",
    color: "secondary",
    pinned: false,
    thresholds: defaultThresholds["cost-per-unit"],
  },
];

const performanceActions = [
  { id: "update-plan", label: "Update Plan", icon: "ri-edit-line", color: "primary" as const },
  { id: "log-output", label: "Log Output", icon: "ri-add-circle-line", color: "primary" as const },
  { id: "create-report", label: "Create Report", icon: "ri-file-add-line", color: "primary" as const },
  { id: "export-data", label: "Export Data", icon: "ri-download-line", color: "secondary" as const },
];

export default function PerformancePage() {
  const [kpis, setKpis] = useState<PerformanceKpi[]>(performanceKpis);
  const [viewMode, setViewMode] = useState("production");
  const { syncPageKpis, clearPageKpis } = useThresholdAlerts();
  const [showUpdatePlan, setShowUpdatePlan] = useState(false);
  const [showLogOutput, setShowLogOutput] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showExportData, setShowExportData] = useState(false);

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
      case "create-report":
        setShowCreateReport(true);
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
      />
      <LogOutputModal
        open={showLogOutput}
        onClose={() => setShowLogOutput(false)}
      />
      <CreateReportModal
        open={showCreateReport}
        onClose={() => setShowCreateReport(false)}
      />
      <ExportReportModal
        open={showExportData}
        onClose={() => setShowExportData(false)}
      />
    </>
  );
}