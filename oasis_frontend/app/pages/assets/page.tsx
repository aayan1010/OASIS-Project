"use client"; 

import TopOverview from "../../components/feature/TopOverview"; 
import { useState } from "react"; 
import dynamic from "next/dynamic"; // 1. Add this import
import TelemetryTicker from "./components/TelemetryTicker"; 
import ExportReportModal from "../../pages/overview/components/ExportReportModal"; 

// 2. Replace the static import with this dynamic one:
const GISMapView = dynamic(() => import("./components/GISMapView"), { 
  ssr: false,
});

const assetKpis = [
  {
    id: "total-assets",
    title: "Total Assets",
    value: 332,
    change: "+4",
    changeType: "neutral" as const,
    icon: "ri-server-line",
    color: "secondary" as const,
    pinned: true,
  },
  {
    id: "critical-assets",
    title: "Critical Assets",
    value: 18,
    change: "-2",
    changeType: "positive" as const,
    icon: "ri-alarm-warning-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "avg-health",
    title: "Avg Asset Health",
    value: "92%",
    change: "+1.5%",
    changeType: "positive" as const,
    icon: "ri-heart-pulse-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "telemetry-channels",
    title: "Live Telemetry Channels",
    value: 156,
    change: "+8",
    changeType: "neutral" as const,
    icon: "ri-signal-tower-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "downtime-impact",
    title: "Downtime Impact",
    value: "$28K",
    change: "-12%",
    changeType: "positive" as const,
    icon: "ri-money-dollar-circle-line",
    color: "secondary" as const,
    pinned: false,
  },
  {
    id: "rul-critical",
    title: "RUL Critical",
    value: 7,
    change: "+1",
    changeType: "negative" as const,
    icon: "ri-hourglass-line",
    color: "accent" as const,
    pinned: false,
  },
];

const assetActions = [
  { id: "add-asset", label: "Add Asset", icon: "ri-add-circle-line", color: "primary" as const },
  { id: "run-diagnostic", label: "Run Diagnostic", icon: "ri-stethoscope-line", color: "primary" as const },
  { id: "export-registry", label: "Export Registry", icon: "ri-download-line", color: "secondary" as const },
];

export default function AssetsPage() {
  const [kpis, setKpis] = useState(assetKpis);
  const [viewMode, setViewMode] = useState("map");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
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