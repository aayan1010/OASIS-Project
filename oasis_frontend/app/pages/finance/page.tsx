"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState, useMemo } from "react";
import BudgetChart from "./components/BudgetChart";
import OpexBreakdown from "./components/OpexBreakdown";
import RevenueStreams from "./components/RevenueStreams";
import CostMetrics from "./components/CostMetrics";
import ExportReportModal from "../../pages/overview/components/ExportReportModal";
import { useRevenueStreams, useMonthlyBudget, useCostPerUnit, useCapexProjects } from "../../lib/api";

const financeActions = [
  { id: "create-report", label: "Create Report", icon: "ri-file-add-line", color: "primary" as const },
  { id: "view-budget", label: "View Budget", icon: "ri-pie-chart-line", color: "primary" as const },
  { id: "export-data", label: "Export Data", icon: "ri-download-line", color: "secondary" as const },
];

export default function FinancePage() {
  const { data: revenueStreams } = useRevenueStreams();
  const { data: monthlyBudget } = useMonthlyBudget();
  const { data: costPerUnit } = useCostPerUnit();
  const { data: capexProjects } = useCapexProjects();
  const [viewMode, setViewMode] = useState("budget");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Compute live KPI values from Firestore data.
  const totalRevenueMtd = useMemo(
    () => revenueStreams.reduce((s, r) => s + r.amount, 0),
    [revenueStreams],
  );
  const totalOpexMtd = useMemo(
    () => monthlyBudget.reduce((s, r) => s + (r.actual ?? r.budget ?? 0), 0),
    [monthlyBudget],
  );
  const totalBudget = useMemo(
    () => monthlyBudget.reduce((s, r) => s + (r.budget ?? 0), 0),
    [monthlyBudget],
  );
  const budgetVsActual = totalBudget > 0 ? Math.round((totalOpexMtd / totalBudget) * 1000) / 10 : null;
  const latestCpu = costPerUnit.length ? costPerUnit[costPerUnit.length - 1] : null;
  const latestCpuValue = latestCpu
    ? ((latestCpu as { liftingCost?: number }).liftingCost ?? (latestCpu as { opsCost?: number }).opsCost ?? null)
    : null;
  const totalCapex = useMemo(
    () => capexProjects.reduce((s, p) => s + (p.budget ?? 0), 0),
    [capexProjects],
  );

  const liveKpis = useMemo(() => [
    {
      id: "opex-mtd",
      title: "OPEX (MTD)",
      value: totalOpexMtd > 0 ? `$${(totalOpexMtd / 1_000_000).toFixed(2)}M` : "$1.24M",
      change: "-2.3%",
      changeType: "positive" as const,
      icon: "ri-money-dollar-circle-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "budget-vs-actual",
      title: "Budget vs Actual",
      value: budgetVsActual !== null ? `${budgetVsActual}%` : "97.7%",
      change: budgetVsActual !== null && budgetVsActual < 100 ? "Under budget" : "Over budget",
      changeType: budgetVsActual !== null && budgetVsActual < 100 ? "positive" as const : "negative" as const,
      icon: "ri-pie-chart-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "revenue-mtd",
      title: "Revenue (MTD)",
      value: totalRevenueMtd > 0 ? `$${(totalRevenueMtd / 1_000_000).toFixed(1)}M` : "$3.8M",
      change: "+4.1%",
      changeType: "positive" as const,
      icon: "ri-line-chart-line",
      color: "secondary" as const,
      pinned: true,
    },
    {
      id: "cost-per-unit",
      title: "Cost Per Unit",
      value: latestCpuValue !== null ? `$${latestCpuValue.toFixed(2)}` : "$42.50",
      change: "-1.2%",
      changeType: "positive" as const,
      icon: "ri-price-tag-3-line",
      color: "secondary" as const,
      pinned: true,
    },
    {
      id: "capex-ytd",
      title: "CAPEX (YTD)",
      value: totalCapex > 0 ? `$${(totalCapex / 1_000_000).toFixed(1)}M` : "$4.2M",
      change: "+8%",
      changeType: "negative" as const,
      icon: "ri-building-line",
      color: "accent" as const,
      pinned: false,
    },
    {
      id: "roi",
      title: "ROI",
      value: totalOpexMtd > 0 && totalRevenueMtd > 0
        ? `${Math.round(((totalRevenueMtd - totalOpexMtd) / totalOpexMtd) * 1000) / 10}%`
        : "18.4%",
      change: "+0.6%",
      changeType: "positive" as const,
      icon: "ri-percent-line",
      color: "primary" as const,
      pinned: false,
    },
  ], [totalOpexMtd, budgetVsActual, totalRevenueMtd, latestCpu, totalCapex]);

  const [pinnedOverrides, setPinnedOverrides] = useState<Record<string, boolean>>({});
  const kpis = liveKpis.map((k) => ({
    ...k,
    pinned: k.id in pinnedOverrides ? pinnedOverrides[k.id] : k.pinned,
  }));

  const handleTogglePin = (id: string) => {
    const current = kpis.find((k) => k.id === id);
    setPinnedOverrides((prev) => ({ ...prev, [id]: !current?.pinned }));
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "create-report":
        break;
      case "view-budget":
        break;
      case "export-data":
        setExportModalOpen(true);
        break;
    }
  };

  return (
    <>
      <TopOverview
        title="Finance"
        subtitle="Cost tracking, budget analysis, and operational financial metrics"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={financeActions.map((a) => ({
          ...a,
          onClick: () => handleAction(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "budget", label: "Budget & OPEX", icon: "ri-pie-chart-line" },
            { id: "revenue", label: "Revenue & ROI", icon: "ri-line-chart-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "budget" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BudgetChart />
              <OpexBreakdown />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {revenueStreams.slice(0, 4).map((stream) => (
                <div key={stream.stream} className="bg-background-50 rounded-lg border border-background-200/70 p-4">
                  <p className="text-xs text-foreground-500 mb-1">{stream.stream}</p>
                  <p className="text-lg font-heading font-semibold text-foreground-900">${(stream.amount / 1000000).toFixed(2)}M</p>
                  <p className={`text-xs mt-1 ${stream.growth.startsWith("+") ? "text-emerald-600" : "text-accent-600"}`}>
                    {stream.growth} vs last month
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <RevenueStreams />
            <CostMetrics />
          </div>
        )}
      </div>

      <ExportReportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
    </>
  );
}
