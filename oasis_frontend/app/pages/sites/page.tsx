"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; 
const GISMapView = dynamic(() => import("../../pages/assets/components/GISMapView"), { 
  ssr: false,
});
import ShipmentTracker from "../../pages/logistics/components/ShipmentTracker";
import SupplyChainHealth from "../../pages/logistics/components/SupplyChainHealth";
import InventoryStatus from "../../pages/logistics/components/InventoryStatus";
import WarehouseUtilization from "../../pages/logistics/components/WarehouseUtilization";
import ExportReportModal from "../../pages/overview/components/ExportReportModal";
import RunDiagnosticModal from "../../pages/sites/components/RunDiagnosticModal";
import CreateShipmentModal from "../../pages/sites/components/CreateShipmentModal";
import { useAssets, useSites, useAlerts } from "../../lib/api";

const sitesActions = [
  { id: "run-diagnostic", label: "Run Diagnostic", icon: "ri-stethoscope-line", color: "primary" as const },
  { id: "create-shipment", label: "Create Shipment", icon: "ri-truck-line", color: "primary" as const },
  { id: "export-registry", label: "Export Registry", icon: "ri-download-line", color: "secondary" as const },
];

export default function SitesPage() {
  const router = useRouter();
  const { data: assetLocations } = useAssets();
  const { data: sites } = useSites();
  const { data: alertRecords } = useAlerts();
  const activeAlertCount = alertRecords.filter((a) => a.status === "active").length;

  const [pinnedIds, setPinnedIds] = useState<string[]>(["total-assets", "active-sites", "avg-health", "offline-assets"]);
  const kpis = [
    {
      id: "total-assets",
      title: "Total Assets",
      value: assetLocations.length,
      change: "+4",
      changeType: "neutral" as const,
      icon: "ri-server-line",
      color: "secondary" as const,
    },
    {
      id: "active-sites",
      title: "Active Sites",
      value: sites.filter((s) => s.status === "Active").length,
      change: "0",
      changeType: "neutral" as const,
      icon: "ri-building-line",
      color: "primary" as const,
    },
    {
      id: "avg-health",
      title: "Avg Asset Health",
      value: `${Math.round(assetLocations.reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.length))}%`,
      change: "+1.5%",
      changeType: "positive" as const,
      icon: "ri-heart-pulse-line",
      color: "primary" as const,
    },
    {
      id: "offline-assets",
      title: "Offline / Warning",
      value: assetLocations.filter((a) => a.status === "offline" || a.status === "degraded").length,
      change: "+1",
      changeType: "negative" as const,
      icon: "ri-alarm-warning-line",
      color: "accent" as const,
    },
    {
      id: "active-alerts",
      title: "Active Alerts",
      value: activeAlertCount,
      change: "+3",
      changeType: "negative" as const,
      icon: "ri-alarm-warning-line",
      color: "accent" as const,
    },
    {
      id: "telemetry-channels",
      title: "Under Maintenance",
      value: assetLocations.filter((a) => a.status === "maintenance").length,
      change: "0",
      changeType: "neutral" as const,
      icon: "ri-tools-line",
      color: "primary" as const,
    },
  ].map((k) => ({ ...k, pinned: pinnedIds.includes(k.id) }));
  const [viewMode, setViewMode] = useState("map");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);

  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "run-diagnostic":
        setDiagnosticModalOpen(true);
        break;
      case "create-shipment":
        setShipmentModalOpen(true);
        break;
      case "export-registry":
        setExportModalOpen(true);
        break;
    }
  };

  return (
    <>
      <TopOverview
        title="Sites"
        subtitle="Asset GIS tracking, telemetry monitoring, supply chain, and inventory management"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={sitesActions.map((a) => ({
          ...a,
          onClick: () => handleAction(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "map", label: "GIS Map", icon: "ri-map-2-line" },
            { id: "supply-chain", label: "Supply Chain & Inventory", icon: "ri-truck-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "map" ? (
          <GISMapView />
        ) : (
          <div className="space-y-4">
            <ShipmentTracker />
            <SupplyChainHealth />
            <InventoryStatus />
            <WarehouseUtilization />
          </div>
        )}
      </div>

      <ExportReportModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <RunDiagnosticModal open={diagnosticModalOpen} onClose={() => setDiagnosticModalOpen(false)} />
      <CreateShipmentModal open={shipmentModalOpen} onClose={() => setShipmentModalOpen(false)} />
    </>
  );
}
