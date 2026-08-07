"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopOverview from "../../components/feature/TopOverview";
import type { AlertThreshold } from "../../components/feature/ThresholdSettings";
import { useThresholdAlerts } from "../../hooks/ThresholdAlertContext";
import { dashboardKpiData, quickActions, sectorOverview } from "../../mocks/dashboard";
import { recentAlerts } from "../../mocks/alerts";
import { assetLocations } from "../../mocks/assets";
import { sites as mockSites } from "../../mocks/sites";
import { workOrders as mockWorkOrders } from "../../mocks/maintenance";
import ReportIncidentModal from "./components/ReportIncidentModal";
import ExportReportModal from "./components/ExportReportModal";
import AddCardModal, { type KpiItem } from "./components/AddCardModal";
import {
  useAlerts,
  useAssets,
  useWorkOrders,
  useSites,
  useIncidents,
  useProductionRecords,
} from "../../lib/api";

const defaultThresholds: Record<string, AlertThreshold> = {
  "active-alerts": { warning: 15, critical: 20, direction: "above", enabled: true },
  "system-health": { warning: 85, critical: 70, direction: "below", enabled: true },
  "production-rate": { warning: 10000, critical: 8000, direction: "below", enabled: true },
  "maintenance-backlog": { warning: 25, critical: 35, direction: "above", enabled: true },
  "energy-output": { warning: 400, critical: 350, direction: "below", enabled: true },
  "safety-incidents": { warning: 5, critical: 10, direction: "above", enabled: true },
  "downtime": { warning: 8, critical: 12, direction: "above", enabled: true },
  "cost-variance": { warning: 5, critical: 10, direction: "above", enabled: false },
};

// Static KPI metadata (titles, icons, colors) — values are overridden with live data below.
const kpiMeta = dashboardKpiData.map((kpi) => ({
  ...kpi,
  thresholds: defaultThresholds[kpi.id] || { warning: 0, critical: 0, direction: "below" as const, enabled: false },
}));

export default function Home() {
  const router = useRouter();

  // Live data from Firestore via SWR.
  const { data: liveAlerts } = useAlerts();
  const { data: liveAssets } = useAssets();
  const { data: liveWorkOrders } = useWorkOrders();
  const { data: liveSites } = useSites();
  const { data: liveIncidents } = useIncidents();
  const { data: liveProductionRecords } = useProductionRecords();

  // Derive KPI values from the most recent live data, falling back to mock values.
  const liveKpiValues = useMemo(() => {
    const openIncidents = liveIncidents.filter((i) => (i.status ?? "open") === "open").length;
    const activeAlerts = liveAlerts.filter((a) => a.status === "active").length + openIncidents;

    const avgHealth = liveAssets.length
      ? Math.round(liveAssets.reduce((s, a) => s + ((a as { healthScore?: number }).healthScore ?? 0), 0) / liveAssets.length * 10) / 10
      : null;

    // Resolve a record's date to an ISO string regardless of Firestore Timestamp vs string.
    const toDateStr = (d: unknown): string => {
      if (!d) return "";
      if (typeof d === "string") return d;
      if (typeof d === "object" && "_seconds" in (d as object)) {
        return new Date((d as { _seconds: number })._seconds * 1000).toISOString().slice(0, 10);
      }
      return String(d);
    };

    // Latest date's total production, downtime, and energy across all sites.
    const recordsWithDates = liveProductionRecords.map((r) => ({ ...r, _dateStr: toDateStr(r.date) }));
    const sortedRecords = [...recordsWithDates].sort((a, b) => b._dateStr.localeCompare(a._dateStr));
    const latestDate = sortedRecords[0]?._dateStr;
    const latestDayRecords = latestDate ? sortedRecords.filter((r) => r._dateStr === latestDate) : [];
    const totalProduction = latestDayRecords.length
      ? latestDayRecords.reduce((s, r) => s + (r.actual_production ?? 0), 0)
      : null;
    const totalDowntime = latestDayRecords.length
      ? Math.round(latestDayRecords.reduce((s, r) => s + (r.downtime_hours ?? 0), 0) * 10) / 10
      : null;
    const totalEnergy = latestDayRecords.length
      ? Math.round(latestDayRecords.reduce((s, r) => s + (r.energy_used_kwh ?? 0), 0))
      : null;

    const openWOs = liveWorkOrders.filter((w) => w.status === "open").length;
    const closedWOs = liveWorkOrders.filter((w) => w.status === "closed").length;

    // MTD incidents: reported incidents this calendar month.
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const mtdIncidents = liveIncidents.filter((i) => (i.dateLogged ?? "").startsWith(monthPrefix)).length;

    return { activeAlerts, avgHealth, totalProduction, totalDowntime, totalEnergy, openWOs, closedWOs, mtdIncidents };
  }, [liveAlerts, liveAssets, liveProductionRecords, liveWorkOrders, liveIncidents]);

  // Merge static metadata with live values.
  const kpisWithThresholds = useMemo(() => kpiMeta.map((kpi) => {
    switch (kpi.id) {
      case "active-alerts":
        return { ...kpi, value: liveKpiValues.activeAlerts };
      case "system-health":
        return { ...kpi, value: liveKpiValues.avgHealth !== null ? `${liveKpiValues.avgHealth}%` : kpi.value };
      case "production-rate":
        return { ...kpi, value: liveKpiValues.totalProduction !== null ? Math.round(liveKpiValues.totalProduction).toLocaleString() : kpi.value };
      case "maintenance-backlog":
        return { ...kpi, value: liveKpiValues.openWOs };
      case "energy-output":
        return { ...kpi, value: liveKpiValues.totalEnergy !== null ? liveKpiValues.totalEnergy.toLocaleString() : kpi.value };
      case "safety-incidents":
        return { ...kpi, value: liveKpiValues.mtdIncidents };
      case "downtime":
        return { ...kpi, value: liveKpiValues.totalDowntime !== null ? String(liveKpiValues.totalDowntime) : kpi.value };
      default:
        return kpi;
    }
  }), [liveKpiValues]);

  // Store only user-driven overrides (pinned, thresholds) separately so they
  // never feed back into the live-data memo chain and cause an infinite loop.
  type KpiOverrides = Record<string, { pinned?: boolean; thresholds?: AlertThreshold }>;
  const [kpiOverrides, setKpiOverrides] = useState<KpiOverrides>({});

  // Merge live-derived values with any per-card user overrides.
  const kpis = useMemo(
    () => kpisWithThresholds.map((kpi) => ({ ...kpi, ...kpiOverrides[kpi.id] })),
    [kpisWithThresholds, kpiOverrides],
  );

  // setKpis is called by child components that update the whole array (e.g. AddCardModal,
  // ThresholdSettings). Extract only the override-able fields and store them.
  const setKpis = (updater: typeof kpis | ((prev: typeof kpis) => typeof kpis)) => {
    const next = typeof updater === "function" ? updater(kpis) : updater;
    setKpiOverrides(
      next.reduce<KpiOverrides>((acc, k) => {
        acc[k.id] = { pinned: k.pinned, thresholds: k.thresholds };
        return acc;
      }, {}),
    );
  };
  const [activeSector, setActiveSector] = useState("upstream");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const { breachAlerts, syncPageKpis, clearPageKpis } = useThresholdAlerts();

  useEffect(() => {
    syncPageKpis("overview", kpis);
    return () => clearPageKpis("overview");
  }, [kpis, syncPageKpis, clearPageKpis]);

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  const handleAddCard = (kpi: KpiItem) => {
    setKpis((prev) => {
      if (prev.some((k) => k.id === kpi.id)) return prev;
      return [...prev, kpi];
    });
    setShowAddCardModal(false);
  };

  const handleRemoveCard = (id: string) => {
    setKpis((prev) => prev.filter((k) => k.id !== id));
  };

  const handleThresholdsChange = (id: string, t: AlertThreshold) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, thresholds: t } : k))
    );
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "create-work-order":
        router.push("pages/maintenance");
        break;
      case "report-incident":
        setShowReportModal(true);
        break;
      case "export-report":
        setShowExportModal(true);
        break;
      case "schedule-inspection":
        router.push("pages/maintenance");
        break;
      case "view-telemetry":
        router.push("pages/performance");
        break;
      default:
        break;
    }
  };

  const allAlerts = [...breachAlerts, ...recentAlerts];

  return (
    <>
      <TopOverview
        title="Overview"
        subtitle="Real-time oil & gas KPIs, alerts, and system health across all operations"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        onThresholdsChange={handleThresholdsChange}
        onAddCard={() => setShowAddCardModal(true)}
        onRemoveCard={handleRemoveCard}
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
                {allAlerts.filter((a) => a.status === "active").length} active
              </span>
            </div>
            <div className="divide-y divide-background-100 max-h-[420px] overflow-y-auto">
              {allAlerts.map((alert) => (
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground-800 truncate">
                        {alert.title}
                      </p>
                      {"source" in alert && alert.source === "threshold" && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                          Threshold
                        </span>
                      )}
                    </div>
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
              {allAlerts.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-emerald-50 mb-2">
                    <i className="ri-check-line text-emerald-500 text-lg"></i>
                  </div>
                  <p className="text-sm text-foreground-600">All clear — no active alerts</p>
                </div>
              )}
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
                    {liveSites.length || mockSites.length}
                  </p>
                  <p className="text-xs text-foreground-500">Active Sites</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-secondary-600 mb-1">
                    <i className="ri-cpu-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {liveAssets.length || assetLocations.length}
                  </p>
                  <p className="text-xs text-foreground-500">Total Assets</p>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-accent-600 mb-1">
                    <i className="ri-alarm-warning-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {liveAssets.filter((a) => (a as { status?: string }).status === "offline" || (a as { status?: string }).status === "degraded").length || assetLocations.filter((a) => a.status === "offline" || a.status === "degraded").length}
                  </p>
                  <p className="text-xs text-foreground-500">Assets at Risk</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-primary-600 mb-1">
                    <i className="ri-tools-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {liveKpiValues.closedWOs || mockWorkOrders.filter((w) => w.status === "closed").length}
                  </p>
                  <p className="text-xs text-foreground-500">WOs Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportIncidentModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
      <ExportReportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      <AddCardModal
        open={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        existingIds={kpis.map((k) => k.id)}
        onAdd={handleAddCard}
      />
    </>
  );
}
