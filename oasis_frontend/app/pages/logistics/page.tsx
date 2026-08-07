"use client";

import DashboardLayout from "../../components/feature/DashboardLayout";
import TopOverview from "../../components/feature/TopOverview";
import { useState, useMemo } from "react";
import InventoryStatus from "./components/InventoryStatus";
import ShipmentTracker from "./components/ShipmentTracker";
import SupplyChainHealth from "./components/SupplyChainHealth";
import WarehouseUtilization from "./components/WarehouseUtilization";
import { useInventory, useShipments, useWarehouses } from "../../lib/api";

const logisticsActions = [
  { id: "create-shipment", label: "Create Shipment", icon: "ri-truck-line", color: "primary" as const },
  { id: "order-parts", label: "Order Parts", icon: "ri-shopping-cart-line", color: "primary" as const },
  { id: "view-inventory", label: "View Inventory", icon: "ri-archive-line", color: "secondary" as const },
];

export default function LogisticsPage() {
  const { data: inventory } = useInventory();
  const { data: shipments } = useShipments();
  const { data: warehouses } = useWarehouses();

  const lowStockCount = inventory.filter((i) => i.status === "Low Stock").length;
  const inTransitCount = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length;
  const avgWarehouseUtil = warehouses.length
    ? Math.round(warehouses.reduce((s, w) => s + w.utilization, 0) / warehouses.length)
    : null;

  const liveKpis = useMemo(() => [
    {
      id: "inventory-level",
      title: "Inventory Level",
      value: avgWarehouseUtil !== null ? `${avgWarehouseUtil}%` : "84%",
      change: avgWarehouseUtil !== null && avgWarehouseUtil > 85 ? "Near capacity" : "Adequate",
      changeType: "neutral" as const,
      icon: "ri-archive-line",
      color: "secondary" as const,
      pinned: true,
    },
    {
      id: "low-stock-items",
      title: "Low Stock Items",
      value: lowStockCount,
      change: lowStockCount > 0 ? `${lowStockCount} need reorder` : "All stocked",
      changeType: lowStockCount > 3 ? "negative" as const : "neutral" as const,
      icon: "ri-alarm-warning-line",
      color: "accent" as const,
      pinned: true,
    },
    {
      id: "shipments-in-transit",
      title: "Shipments In Transit",
      value: inTransitCount,
      change: `${shipments.length} total shipments`,
      changeType: "neutral" as const,
      icon: "ri-truck-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "delivery-performance",
      title: "Delivered",
      value: shipments.filter((s) => s.status === "Delivered").length,
      change: `of ${shipments.length} shipments`,
      changeType: "positive" as const,
      icon: "ri-check-double-line",
      color: "primary" as const,
      pinned: true,
    },
    {
      id: "supply-chain-risk",
      title: "Supply Chain Risk",
      value: lowStockCount > 5 ? "High" : lowStockCount > 2 ? "Medium" : "Low",
      change: "Based on stock levels",
      changeType: lowStockCount > 5 ? "negative" as const : lowStockCount > 2 ? "neutral" as const : "positive" as const,
      icon: "ri-shield-line",
      color: "secondary" as const,
      pinned: false,
    },
    {
      id: "warehouses",
      title: "Active Warehouses",
      value: warehouses.length,
      change: `${warehouses.filter((w) => w.status === "Operational").length} operational`,
      changeType: "neutral" as const,
      icon: "ri-store-2-line",
      color: "secondary" as const,
      pinned: false,
    },
  ], [inventory, shipments, warehouses, lowStockCount, inTransitCount, avgWarehouseUtil]);

  const [pinnedOverrides, setPinnedOverrides] = useState<Record<string, boolean>>({});
  const kpis = liveKpis.map((k) => ({
    ...k,
    pinned: k.id in pinnedOverrides ? pinnedOverrides[k.id] : k.pinned,
  }));
  const [viewMode, setViewMode] = useState("supply-chain");

  const handleTogglePin = (id: string) => {
    const current = kpis.find((k) => k.id === id);
    setPinnedOverrides((prev) => ({ ...prev, [id]: !current?.pinned }));
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
