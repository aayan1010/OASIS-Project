"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopOverview from "../../components/feature/TopOverview";
import type { AlertThreshold } from "../../components/feature/ThresholdSettings";
import { useThresholdAlerts } from "../../hooks/ThresholdAlertContext";
import { dashboardKpiData, quickActions, sectorOverview } from "../../mocks/dashboard";
import { recentAlerts } from "../../mocks/alerts";
import { assetLocations } from "../../mocks/assets";
import { sites } from "../../mocks/sites";
import { workOrders } from "../../mocks/maintenance";
import ReportIncidentModal from "./components/ReportIncidentModal";
import ExportReportModal from "./components/ExportReportModal";

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

const kpisWithThresholds = dashboardKpiData.map((kpi) => ({
  ...kpi,
  color: kpi.color as "accent" | "primary" | "secondary" | undefined, 
  thresholds: defaultThresholds[kpi.id] || { warning: 0, critical: 0, direction: "below" as const, enabled: false },
}));

export default function Home() {
  const router = useRouter();
  const [kpis, setKpis] = useState(kpisWithThresholds);
  const [activeSector, setActiveSector] = useState("upstream");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
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

  const handleThresholdsChange = (id: string, t: AlertThreshold) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, thresholds: t } : k))
    );
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "create-work-order":
        router.push("/pages/maintenance");
        break;
      case "report-incident":
        setShowReportModal(true);
        break;
      case "export-report":
        setShowExportModal(true);
        break;
      case "schedule-inspection":
        router.push("/pages/maintenance");
        break;
      case "view-telemetry":
        router.push("/pages/performance");
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
                    {sites.length}
                  </p>
                  <p className="text-xs text-foreground-500">Active Sites</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-secondary-600 mb-1">
                    <i className="ri-cpu-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {assetLocations.length}
                  </p>
                  <p className="text-xs text-foreground-500">Total Assets</p>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-accent-600 mb-1">
                    <i className="ri-alarm-warning-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {assetLocations.filter((a) => a.status === "offline" || a.status === "degraded").length}
                  </p>
                  <p className="text-xs text-foreground-500">Assets at Risk</p>
                </div>
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-primary-600 mb-1">
                    <i className="ri-tools-line text-lg"></i>
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground-900">
                    {workOrders.filter((w) => w.status === "closed").length}
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
    </>
  );
}