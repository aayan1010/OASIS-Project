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
import AddCardModal, { type KpiItem, type PremadeTemplate } from "../../pages/overview/components/AddCardModal";
import { useAssets, useSites, useAlerts } from "../../lib/api";

const sitesActions = [
  { id: "run-diagnostic", label: "Run Diagnostic", icon: "ri-stethoscope-line", color: "primary" as const },
  { id: "export-registry", label: "Export Registry", icon: "ri-download-line", color: "secondary" as const },
];

export default function SitesPage() {
  const router = useRouter();
  const { data: assetLocations } = useAssets();
  const { data: sites } = useSites();
  const { data: alertRecords } = useAlerts();
  const activeAlertCount = alertRecords.filter((a) => a.status === "active").length;

  const [pinnedIds, setPinnedIds] = useState<string[]>(["total-assets", "active-sites", "avg-health", "offline-assets"]);
  const [addedCards, setAddedCards] = useState<KpiItem[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const baseKpis = [
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
  ];
  const kpis = [...baseKpis, ...addedCards]
    .filter((k) => !removedIds.includes(k.id))
    .map((k) => ({ ...k, pinned: pinnedIds.includes(k.id) }));

  // Page-specific premade cards derived from live sites/assets/alerts data.
  const sitesPremadeTemplates: PremadeTemplate[] = [
    { id: "premade-total-sites", title: "Total Sites", subtitle: "All registered sites", icon: "ri-building-line", color: "primary", compute: () => ({ value: sites.length }) },
    { id: "premade-active-sites", title: "Active Sites", subtitle: "Sites currently operational", icon: "ri-check-double-line", color: "primary", compute: () => ({ value: sites.filter((s) => s.status === "Active").length }) },
    { id: "premade-total-assets", title: "Total Assets", subtitle: "All tracked equipment", icon: "ri-server-line", color: "secondary", compute: () => ({ value: assetLocations.length }) },
    { id: "premade-online-assets", title: "Online Assets", subtitle: "Currently operational", icon: "ri-wifi-line", color: "secondary", compute: () => ({ value: assetLocations.filter((a) => a.status === "online").length }) },
    { id: "premade-offline-assets", title: "Offline / Degraded", subtitle: "Assets requiring attention", icon: "ri-close-circle-line", color: "accent", compute: () => ({ value: assetLocations.filter((a) => a.status === "offline" || a.status === "degraded").length }) },
    { id: "premade-maintenance-assets", title: "Under Maintenance", subtitle: "Assets being serviced", icon: "ri-tools-line", color: "primary", compute: () => ({ value: assetLocations.filter((a) => a.status === "maintenance").length }) },
    { id: "premade-avg-health", title: "Average Asset Health", subtitle: "Mean health score across assets", icon: "ri-heart-pulse-line", color: "secondary", compute: () => ({ value: `${Math.round(assetLocations.reduce((s, a) => s + (a.healthScore ?? 0), 0) / Math.max(1, assetLocations.length) * 10) / 10}%` }) },
    { id: "premade-critical-assets", title: "Critical Assets", subtitle: "Health score below 30%", icon: "ri-alert-line", color: "accent", compute: () => ({ value: assetLocations.filter((a) => (a.healthScore ?? 100) < 30).length }) },
    { id: "premade-active-alerts", title: "Active Alerts", subtitle: "Currently open alerts", icon: "ri-alarm-warning-line", color: "accent", compute: () => ({ value: activeAlertCount }) },
  ];

  const [viewMode, setViewMode] = useState("map");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAddCard = (kpi: KpiItem) => {
    setAddedCards((prev) => (prev.some((k) => k.id === kpi.id) ? prev : [...prev, kpi]));
    setPinnedIds((prev) => (prev.includes(kpi.id) ? prev : [...prev, kpi.id]));
    setRemovedIds((prev) => prev.filter((i) => i !== kpi.id));
    setShowAddCardModal(false);
  };

  const handleRemoveCard = (id: string) => {
    setAddedCards((prev) => prev.filter((k) => k.id !== id));
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setPinnedIds((prev) => prev.filter((i) => i !== id));
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
        onAddCard={() => setShowAddCardModal(true)}
        onRemoveCard={handleRemoveCard}
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
      <AddCardModal
        open={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        existingIds={kpis.map((k) => k.id)}
        onAdd={handleAddCard}
        premadeTemplates={sitesPremadeTemplates}
      />
    </>
  );
}
