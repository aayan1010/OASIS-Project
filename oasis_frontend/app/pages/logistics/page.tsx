"use client";

import DashboardLayout from "../../components/feature/DashboardLayout";
import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import InventoryStatus from "./components/InventoryStatus";
import ShipmentTracker from "./components/ShipmentTracker";
import SupplyChainHealth from "./components/SupplyChainHealth";
import WarehouseUtilization from "./components/WarehouseUtilization";

const logisticsKpis = [
  {
    id: "inventory-level",
    title: "Inventory Level",
    value: "84%",
    change: "-2%",
    changeType: "neutral" as const,
    icon: "ri-archive-line",
    color: "secondary" as const,
    pinned: true,
  },
  {
    id: "low-stock-items",
    title: "Low Stock Items",
    value: 12,
    change: "+3",
    changeType: "negative" as const,
    icon: "ri-alarm-warning-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "shipments-in-transit",
    title: "Shipments In Transit",
    value: 8,
    change: "+1",
    changeType: "neutral" as const,
    icon: "ri-truck-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "delivery-performance",
    title: "Delivery Performance",
    value: "92%",
    change: "+1%",
    changeType: "positive" as const,
    icon: "ri-check-double-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "supply-chain-risk",
    title: "Supply Chain Risk",
    value: "Low",
    change: "Stable",
    changeType: "neutral" as const,
    icon: "ri-shield-line",
    color: "secondary" as const,
    pinned: false,
  },
  {
    id: "warehouses",
    title: "Active Warehouses",
    value: 4,
    change: "0",
    changeType: "neutral" as const,
    icon: "ri-store-2-line",
    color: "secondary" as const,
    pinned: false,
  },
];

const logisticsActions = [
  { id: "create-shipment", label: "Create Shipment", icon: "ri-truck-line", color: "primary" as const },
  { id: "order-parts", label: "Order Parts", icon: "ri-shopping-cart-line", color: "primary" as const },
  { id: "view-inventory", label: "View Inventory", icon: "ri-archive-line", color: "secondary" as const },
];

export default function LogisticsPage() {
  const [kpis, setKpis] = useState(logisticsKpis);
  const [viewMode, setViewMode] = useState("supply-chain");

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  return (
    <>
      <TopOverview
        title="Logistics"
        subtitle="Supply chain overview, inventory management, and shipment tracking"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={logisticsActions.map((a) => ({
          ...a,
          onClick: () => console.log(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "supply-chain", label: "Supply Chain Monitor", icon: "ri-truck-line" },
            { id: "inventory", label: "Inventory & Warehouse", icon: "ri-archive-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "supply-chain" ? (
          <div className="space-y-4">
            <ShipmentTracker />
            <SupplyChainHealth />
          </div>
        ) : (
          <div className="space-y-4">
            <InventoryStatus />
            <WarehouseUtilization />
          </div>
        )}
      </div>
    </>
  );
}