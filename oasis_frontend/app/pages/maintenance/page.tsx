"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import MaintenanceCalendar from "./components/MaintenanceCalendar";
import KanbanBoard from "./components/KanbanBoard";
import { openWorkOrders, inProgressWorkOrders, totalMaintenanceCost, totalDowntimeHours, overdueWorkOrders, workOrders } from "../../mocks/maintenance";

const maintenanceKpis = [
  {
    id: "total-work-orders",
    title: "Total Work Orders",
    value: workOrders.length,
    change: `${inProgressWorkOrders} in progress`,
    changeType: "neutral" as const,
    icon: "ri-file-list-3-line",
    color: "secondary" as const,
    pinned: true,
  },
  {
    id: "overdue-tasks",
    title: "Overdue Tasks",
    value: overdueWorkOrders,
    change: overdueWorkOrders > 0 ? "+1" : "0",
    changeType: overdueWorkOrders > 5 ? "negative" as const : "neutral" as const,
    icon: "ri-time-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "maintenance-cost",
    title: "MTD Maintenance Cost",
    value: `$${Math.round(totalMaintenanceCost / 1000)}K`,
    change: "-4.2%",
    changeType: "positive" as const,
    icon: "ri-money-dollar-circle-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "pm-compliance",
    title: "Downtime Hours",
    value: String(Math.round(totalDowntimeHours * 10) / 10),
    change: "-8.2 hrs vs. prior",
    changeType: "positive" as const,
    icon: "ri-time-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "spare-parts",
    title: "Open Work Orders",
    value: openWorkOrders,
    change: "-2",
    changeType: "positive" as const,
    icon: "ri-folder-open-line",
    color: "secondary" as const,
    pinned: false,
  },
  {
    id: "crew-utilization",
    title: "Crew Utilization",
    value: "76%",
    change: "+5%",
    changeType: "positive" as const,
    icon: "ri-team-line",
    color: "secondary" as const,
    pinned: false,
  },
];

const maintenanceActions = [
  { id: "create-wo", label: "Create Work Order", icon: "ri-file-add-line", color: "primary" as const },
  { id: "schedule-pm", label: "Schedule PM", icon: "ri-calendar-line", color: "primary" as const },
  { id: "request-parts", label: "Request Parts", icon: "ri-shopping-cart-line", color: "secondary" as const },
];

export default function MaintenancePage() {
  const [kpis, setKpis] = useState(maintenanceKpis);
  const [viewMode, setViewMode] = useState("calendar");

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  return (
    <>
      <TopOverview
        title="Maintenance"
        subtitle="Work order management, preventive maintenance, and asset servicing"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={maintenanceActions.map((a) => ({
          ...a,
          onClick: () => console.log(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "calendar", label: "Calendar", icon: "ri-calendar-line" },
            { id: "kanban", label: "Kanban", icon: "ri-layout-3-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "calendar" ? (
          <MaintenanceCalendar />
        ) : (
          <KanbanBoard />
        )}
      </div>
    </>
  );
}
