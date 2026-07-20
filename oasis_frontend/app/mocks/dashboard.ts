import { assetLocations } from "./assets";
import { alertRecords, activeAlertCount } from "./alerts";
import { totalDailyProduction, avgEfficiency, totalDowntime, totalEnergyUsed } from "./production";
import { openWorkOrders, totalMaintenanceCost, totalDowntimeHours } from "./maintenance";

export const navigationItems = [
  { id: "home", label: "Overview", path: "/", icon: "ri-dashboard-3-line" },
  { id: "performance", label: "Performance", path: "/pages/performance", icon: "ri-line-chart-line" },
  { id: "alerts", label: "Alerts", path: "/pages/alerts", icon: "ri-shield-check-line" },
  { id: "sites", label: "Sites", path: "/pages/sites", icon: "ri-map-2-line" },
  { id: "maintenance", label: "Maintenance", path: "/pages/maintenance", icon: "ri-tools-line" },
];

const avgHealth = Math.round(
  assetLocations.reduce((s, a) => s + (a.healthScore ?? 0), 0) / assetLocations.length * 10
) / 10;

const criticalAssets = assetLocations.filter((a) => (a.healthScore ?? 100) < 60 || a.status === "offline").length;

export const dashboardKpiData = [
  {
    id: "active-alerts",
    title: "Total Active Alerts",
    value: activeAlertCount,
    change: "+3",
    changeType: "negative" as const,
    icon: "ri-alarm-warning-line",
    color: "accent",
    pinned: true,
  },
  {
    id: "system-health",
    title: "System Health",
    value: `${avgHealth}%`,
    change: "+1.2%",
    changeType: "positive" as const,
    icon: "ri-heart-pulse-line",
    color: "primary",
    pinned: true,
  },
  {
    id: "production-rate",
    title: "Production Rate",
    value: totalDailyProduction.toLocaleString(),
    unit: "bbl/day",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: "ri-drop-line",
    color: "secondary",
    pinned: true,
  },
  {
    id: "maintenance-backlog",
    title: "Maintenance Backlog",
    value: openWorkOrders,
    change: "-2",
    changeType: "positive" as const,
    icon: "ri-calendar-check-line",
    color: "secondary",
    pinned: false,
  },
  {
    id: "energy-output",
    title: "Energy Output",
    value: totalEnergyUsed.toLocaleString(),
    unit: "kWh/d",
    change: "+2.7%",
    changeType: "positive" as const,
    icon: "ri-fire-line",
    color: "primary",
    pinned: false,
  },
  {
    id: "safety-incidents",
    title: "Safety Incidents (MTD)",
    value: alertRecords.filter((a) => a.status === "active" && a.severity === "high").length,
    change: "0",
    changeType: "neutral" as const,
    icon: "ri-first-aid-kit-line",
    color: "accent",
    pinned: false,
  },
  {
    id: "downtime",
    title: "Downtime Hours",
    value: String(totalDowntime),
    unit: "hrs",
    change: "-1.2",
    changeType: "positive" as const,
    icon: "ri-time-line",
    color: "secondary",
    pinned: false,
  },
  {
    id: "cost-variance",
    title: "Cost Variance",
    value: "-2.3%",
    change: "Under budget",
    changeType: "positive" as const,
    icon: "ri-money-cny-circle-line",
    color: "primary",
    pinned: false,
  },
];

export const quickActions = [
  { id: "create-work-order", label: "Create Work Order", icon: "ri-file-add-line", color: "primary" },
  { id: "report-incident", label: "Report Incident", icon: "ri-alert-line", color: "accent" },
  { id: "export-report", label: "Export Report", icon: "ri-download-line", color: "secondary" },
  { id: "schedule-inspection", label: "Schedule Inspection", icon: "ri-calendar-line", color: "primary" },
  { id: "view-telemetry", label: "View Telemetry", icon: "ri-radar-line", color: "secondary" },
];

export const recentAlerts = alertRecords.slice(0, 5).map((a) => ({
  id: a.id,
  title: `${a.alertType} — ${a.assetId}`,
  severity: a.severity,
  module: "Assets",
  time: a.timestamp.slice(5, 10).replace("-", "/"),
  status: a.status,
}));

export const sectorOverview = [
  {
    id: "upstream",
    name: "Upstream (E&P)",
    active: true,
    sites: 3,
    assets: assetLocations.filter((a) => ["SITE-001", "SITE-003", "SITE-006"].includes(a.siteId ?? "")).length,
    health: Math.round(assetLocations.filter((a) => ["SITE-001", "SITE-003", "SITE-006"].includes(a.siteId ?? "")).reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.filter((a) => ["SITE-001", "SITE-003", "SITE-006"].includes(a.siteId ?? "")).length)),
    production: `${Math.round(totalDailyProduction * 0.6).toLocaleString()} bbl/day`,
    alerts: alertRecords.filter((a) => ["SITE-001", "SITE-003", "SITE-006"].includes(assetLocations.find((al) => al.id === a.assetId)?.siteId ?? "")).length,
  },
  {
    id: "midstream",
    name: "Midstream",
    active: true,
    sites: 3,
    assets: assetLocations.filter((a) => ["SITE-002", "SITE-004", "SITE-008"].includes(a.siteId ?? "")).length,
    health: Math.round(assetLocations.filter((a) => ["SITE-002", "SITE-004", "SITE-008"].includes(a.siteId ?? "")).reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.filter((a) => ["SITE-002", "SITE-004", "SITE-008"].includes(a.siteId ?? "")).length)),
    production: `${Math.round(totalDailyProduction * 0.3).toLocaleString()} bbl/day`,
    alerts: alertRecords.filter((a) => ["SITE-002", "SITE-004", "SITE-008"].includes(assetLocations.find((al) => al.id === a.assetId)?.siteId ?? "")).length,
  },
  {
    id: "downstream",
    name: "Downstream",
    active: true,
    sites: 1,
    assets: assetLocations.filter((a) => a.siteId === "SITE-005").length,
    health: Math.round(assetLocations.filter((a) => a.siteId === "SITE-005").reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.filter((a) => a.siteId === "SITE-005").length)),
    production: `${Math.round(totalDailyProduction * 0.08).toLocaleString()} bbl/day`,
    alerts: alertRecords.filter((a) => assetLocations.find((al) => al.id === a.assetId)?.siteId === "SITE-005").length,
  },
  {
    id: "gas-processing",
    name: "Gas Processing",
    active: true,
    sites: 1,
    assets: assetLocations.filter((a) => a.siteId === "SITE-007").length,
    health: Math.round(assetLocations.filter((a) => a.siteId === "SITE-007").reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.filter((a) => a.siteId === "SITE-007").length)),
    production: `${Math.round(totalDailyProduction * 0.02).toLocaleString()} bbl/day`,
    alerts: alertRecords.filter((a) => assetLocations.find((al) => al.id === a.assetId)?.siteId === "SITE-007").length,
  },
];