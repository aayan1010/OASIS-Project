"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import { useThresholdAlerts } from "../../hooks/ThresholdAlertContext";
import ReportIncidentModal from "../../pages/overview/components/ReportIncidentModal";
import LogHazardModal from "../../pages/alerts/components/LogHazardModal";
import ScheduleDrillModal from "../../pages/alerts/components/ScheduleDrillModal";
import IncidentTrendChart from "../../pages/safety/components/IncidentTrendChart";
import IncidentsTable from "../../pages/safety/components/IncidentsTable";
import ComplianceGauge from "../../pages/safety/components/ComplianceGauge";
import HazardBreakdown from "../../pages/safety/components/HazardBreakdown";
import SafetyDrills from "../../pages/safety/components/SafetyDrills";
import { useAlerts, useAssets, useIncidents } from "../../lib/api";

// Helper function to safely format dates without crashing
function safeFormatDate(ts: unknown): string {
  if (!ts) return "N/A";
  if (typeof ts === "string") return ts.slice(0, 10);
  try {
    const d = new Date(ts as string | number | Date);
    if (isNaN(d.getTime())) return String(ts).slice(0, 10);
    return d.toISOString().slice(0, 10);
  } catch {
    return String(ts).slice(0, 10);
  }
}

export default function AlertsPage() {
  const { data: alertRecords } = useAlerts();
  const { data: assetLocations } = useAssets();
  const { data: incidents } = useIncidents();

  const activeAlertCount = alertRecords.filter((a) => a.status === "active").length;
  const highSeverityAlertCount = alertRecords.filter((a) => a.status === "active" && a.severity === "high").length;
  const acknowledgedAlertCount = alertRecords.filter((a) => a.status === "acknowledged").length;
  const resolvedAlertCount = alertRecords.filter((a) => a.status === "resolved").length;
  const alertTypeBreakdown = [
    { type: "High Temperature", count: alertRecords.filter((a) => a.alertType === "High Temperature").length },
    { type: "Excess Vibration", count: alertRecords.filter((a) => a.alertType === "Excess Vibration").length },
  ];

  const daysSafe = (() => {
    const dated = incidents
      .map((i) => new Date(i.dateLogged ?? "").getTime())
      .filter((t) => !isNaN(t));
    if (!dated.length) return null;
    return Math.floor((Date.now() - Math.max(...dated)) / 86_400_000);
  })();

  const [pinnedIds, setPinnedIds] = useState<string[]>(["days-safe", "active-alerts", "acknowledged", "resolved-alerts"]);
  const kpis = [
    {
      id: "days-safe",
      title: "Days Without Incident",
      value: daysSafe !== null ? daysSafe : 0,
      change: daysSafe !== null ? `Since last incident` : "No incidents logged",
      changeType: "positive" as const,
      icon: "ri-shield-check-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "active-alerts",
      title: "Active Alerts",
      value: activeAlertCount,
      change: `+${highSeverityAlertCount} high sev`,
      changeType: "negative" as const,
      icon: "ri-alarm-warning-line",
      color: "accent" as const,
      pinned: true,
    },
    {
      id: "acknowledged",
      title: "Acknowledged",
      value: acknowledgedAlertCount,
      change: "Pending review",
      changeType: "neutral" as const,
      icon: "ri-eye-line",
      color: "secondary" as const,
      pinned: true,
    },
    {
      id: "resolved-alerts",
      title: "Resolved",
      value: resolvedAlertCount,
      change: "+6 this week",
      changeType: "positive" as const,
      icon: "ri-check-double-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "assets-critical",
      title: "Critical Assets",
      value: assetLocations.filter((a) => (a.healthScore ?? 100) < 30).length,
      change: "+1",
      changeType: "negative" as const,
      icon: "ri-alert-line",
      color: "accent" as const,
      pinned: false,
    },
    {
      id: "offline-assets",
      title: "Offline Assets",
      value: assetLocations.filter((a) => a.status === "offline").length,
      change: "0",
      changeType: "neutral" as const,
      icon: "ri-signal-wifi-off-line",
      color: "secondary" as const,
      pinned: false,
    },
  ].map((k) => ({ ...k, pinned: pinnedIds.includes(k.id) }));
  const [viewMode, setViewMode] = useState("incidents");
  const { breachAlerts } = useThresholdAlerts();
  const [reportIncidentOpen, setReportIncidentOpen] = useState(false);
  const [logHazardOpen, setLogHazardOpen] = useState(false);
  const [scheduleDrillOpen, setScheduleDrillOpen] = useState(false);

  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <TopOverview
        title="Alerts"
        subtitle="Active alerts, incident tracking, hazard management, and compliance monitoring"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={[
          { id: "report-incident", label: "Report Incident", icon: "ri-alert-line", color: "accent" as const, onClick: () => setReportIncidentOpen(true) },
          { id: "schedule-drill", label: "Schedule Drill", icon: "ri-calendar-line", color: "secondary" as const, onClick: () => setScheduleDrillOpen(true) },
        ]}
        viewToggle={{
          options: [
            { id: "incidents", label: "Incident Dashboard", icon: "ri-alert-line" },
            { id: "asset-alerts", label: "Asset Alerts", icon: "ri-cpu-line" },
            { id: "compliance", label: "Compliance & Audit", icon: "ri-check-double-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {breachAlerts.length > 0 && (
          <div className="mb-4 bg-amber-50/50 rounded-lg border border-amber-200/70 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-amber-200/70">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-alarm-warning-line text-amber-600 text-sm"></i>
                </div>
                <h3 className="text-sm font-heading font-semibold text-foreground-900">
                  Threshold Breach Alerts
                </h3>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {breachAlerts.length}
                </span>
              </div>
              <span className="text-xs text-foreground-400">Auto-generated from KPI thresholds</span>
            </div>
            <div className="divide-y divide-amber-200/40">
              {breachAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-amber-50 transition-colors"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      alert.severity === "high" ? "bg-red-500" : "bg-amber-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground-800">{alert.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-foreground-400">{alert.module}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        alert.level === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {alert.level}
                      </span>
                      <span className="text-xs text-foreground-300">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "incidents" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-5 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-xs text-foreground-400 uppercase tracking-wide mb-2">
                    Days Without Incident
                  </p>
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-3">
                    <span className="text-3xl font-heading font-bold text-primary-600">16</span>
                  </div>
                  <p className="text-xs text-foreground-500">Record: 205 days (Q1 2025)</p>
                  <div className="mt-3 flex items-center justify-center gap-6 text-xs">
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">{activeAlertCount}</p>
                      <p className="text-foreground-400">Active Alerts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">{acknowledgedAlertCount}</p>
                      <p className="text-foreground-400">Acknowledged</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">{resolvedAlertCount}</p>
                      <p className="text-foreground-400">Resolved</p>
                    </div>
                  </div>
                </div>
              </div>
              <IncidentTrendChart />
            </div>
            <IncidentsTable />
            <HazardBreakdown />
          </div>
        )}

        {viewMode === "asset-alerts" && (
          <div className="space-y-4">
            {/* Alert type summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-4">
                <p className="text-xs text-foreground-500 mb-1">Total Alerts</p>
                <p className="text-2xl font-heading font-bold text-foreground-900">{alertRecords.length}</p>
                <p className="text-xs text-foreground-400 mt-1">From CSV dataset</p>
              </div>
              {alertTypeBreakdown.map((t) => (
                <div key={t.type} className="bg-background-50 rounded-lg border border-background-200/70 p-4">
                  <p className="text-xs text-foreground-500 mb-1">{t.type}</p>
                  <p className="text-2xl font-heading font-bold text-foreground-900">{t.count}</p>
                  <div className="mt-2 w-full bg-background-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-accent-500"
                      style={{ width: `${(t.count / alertRecords.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full alert table */}
            <div className="bg-background-50 rounded-lg border border-background-200/70 overflow-hidden">
              <div className="px-5 py-3 border-b border-background-200/70">
                <h3 className="text-sm font-heading font-semibold text-foreground-900">All Asset Alerts</h3>
                <p className="text-xs text-foreground-500 mt-0.5">{alertRecords.length} records from sensor monitoring</p>
              </div>
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background-100/90 border-b border-background-200/70 z-10">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Alert ID</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Asset</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Severity</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-background-100">
                    {alertRecords.map((alert) => (
                      <tr key={alert.id} className="hover:bg-background-100/50 transition-colors">
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-foreground-600">{alert.id}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-medium text-foreground-800">{alert.assetId}</span>
                          <p className="text-[10px] text-foreground-400 mt-0.5 truncate max-w-[120px]">
                            {assetLocations.find((a) => a.id === alert.assetId)?.name ?? "Unknown"}
                          </p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs text-foreground-600">{alert.alertType}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            alert.severity === "high" ? "bg-red-100 text-red-700" :
                            alert.severity === "medium" ? "bg-amber-100 text-amber-700" :
                            "bg-background-200 text-foreground-500"
                          }`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            alert.status === "active" ? "bg-red-100 text-red-700" :
                            alert.status === "acknowledged" ? "bg-amber-100 text-amber-700" :
                            "bg-primary-100 text-primary-700"
                          }`}>
                            {alert.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs text-foreground-400">{safeFormatDate(alert.timestamp)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === "compliance" && (
          <div className="space-y-4">
            {breachAlerts.length > 0 && (
              <div className="bg-amber-50/50 rounded-lg border border-amber-200/70 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-alarm-warning-line text-amber-600 text-sm"></i>
                  </div>
                  <span className="text-sm font-heading font-semibold text-foreground-900">
                    {breachAlerts.length} Threshold {breachAlerts.length === 1 ? "Breach" : "Breaches"} Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {breachAlerts.map((alert) => (
                    <span
                      key={alert.id}
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        alert.level === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {alert.kpiTitle}: {alert.level}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ComplianceGauge />
            <SafetyDrills />
          </div>
        )}
      </div>

      <ReportIncidentModal open={reportIncidentOpen} onClose={() => setReportIncidentOpen(false)} />
      <ScheduleDrillModal open={scheduleDrillOpen} onClose={() => setScheduleDrillOpen(false)} />
    </>
  );
}
