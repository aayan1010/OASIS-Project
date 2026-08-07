"use client"; 

import TopOverview from "../../components/feature/TopOverview"; 
import { useState, useMemo } from "react"; 
import dynamic from "next/dynamic";
import TelemetryTicker from "./components/TelemetryTicker"; 
import ExportReportModal from "../../pages/overview/components/ExportReportModal"; 
import { useAssets, useAlerts, useTelemetry } from "../../lib/api";

const GISMapView = dynamic(() => import("./components/GISMapView"), { 
  ssr: false,
});

const assetActions = [
  { id: "add-asset", label: "Add Asset", icon: "ri-add-circle-line", color: "primary" as const },
  { id: "run-diagnostic", label: "Run Diagnostic", icon: "ri-stethoscope-line", color: "primary" as const },
  { id: "export-registry", label: "Export Registry", icon: "ri-download-line", color: "secondary" as const },
];

export default function AssetsPage() {
  const { data: assets } = useAssets();
  const { data: alerts } = useAlerts();
  const { data: telemetry } = useTelemetry();

  const avgHealth = assets.length
    ? Math.round(assets.reduce((s, a) => s + (a.healthScore ?? 0), 0) / assets.length)
    : 0;
  const criticalAssets = assets.filter((a) => a.status === "offline" || a.status === "degraded").length;
  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  const liveKpis = useMemo(() => [
    {
      id: "total-assets",
      title: "Total Assets",
      value: assets.length,
      change: `${assets.length} registered`,
      changeType: "neutral" as const,
      icon: "ri-server-line",
      color: "secondary" as const,
      pinned: true,
    },
    {
      id: "critical-assets",
      title: "Offline / Degraded",
      value: criticalAssets,
      change: criticalAssets > 0 ? `${criticalAssets} need attention` : "All operational",
      changeType: criticalAssets > 0 ? "negative" as const : "positive" as const,
      icon: "ri-alarm-warning-line",
      color: "accent" as const,
      pinned: true,
    },
    {
      id: "avg-health",
      title: "Avg Asset Health",
      value: `${avgHealth}%`,
      change: avgHealth >= 90 ? "Healthy" : "Needs review",
      changeType: avgHealth >= 90 ? "positive" as const : "negative" as const,
      icon: "ri-heart-pulse-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "telemetry-channels",
      title: "Live Telemetry Channels",
      value: telemetry.length,
      change: `${telemetry.length} active streams`,
      changeType: "neutral" as const,
      icon: "ri-signal-tower-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "active-alerts",
      title: "Active Alerts",
      value: activeAlerts,
      change: activeAlerts > 0 ? `${activeAlerts} unresolved` : "No alerts",
      changeType: activeAlerts > 0 ? "negative" as const : "positive" as const,
      icon: "ri-error-warning-line",
      color: "secondary" as const,
      pinned: false,
    },
    {
      id: "rul-critical",
      title: "Under Maintenance",
      value: assets.filter((a) => a.status === "maintenance").length,
      change: "In service",
      changeType: "neutral" as const,
      icon: "ri-hourglass-line",
      color: "accent" as const,
      pinned: false,
    },
  ], [assets, criticalAssets, avgHealth, telemetry, activeAlerts]);

  const [pinnedOverrides, setPinnedOverrides] = useState<Record<string, boolean>>({});
  const kpis = liveKpis.map((k) => ({
    ...k,
    pinned: k.id in pinnedOverrides ? pinnedOverrides[k.id] : k.pinned,
  }));
  const [viewMode, setViewMode] = useState("map");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleTogglePin = (id: string) => {
    const current = kpis.find((k) => k.id === id);
    setPinnedOverrides((prev) => ({ ...prev, [id]: !current?.pinned }));
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "add-asset":
        break;
      case "run-diagnostic":
        break;
      case "export-registry":
        setExportModalOpen(true);
        break;
    }
  };

  return (
    <>
      <TopOverview
        title="Asset Management"
        subtitle="Asset registry, condition monitoring, and GIS tracking"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={assetActions.map((a) => ({
          ...a,
          onClick: () => handleAction(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "map", label: "GIS Map", icon: "ri-map-2-line" },
            { id: "telemetry", label: "Live Telemetry", icon: "ri-signal-tower-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "map" ? <GISMapView /> : <TelemetryTicker />}
      </div>

      <ExportReportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
    </>
  );
}
