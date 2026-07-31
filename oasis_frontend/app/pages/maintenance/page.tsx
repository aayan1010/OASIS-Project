"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import MaintenanceCalendar from "./components/MaintenanceCalendar";
import KanbanBoard from "./components/KanbanBoard";
import CreateWorkOrderModal from "./components/CreateWorkOrderModal";
import SchedulePMModal from "./components/SchedulePMModal";
import { totalMaintenanceCost, totalDowntimeHours } from "../../mocks/maintenance";
import { useWorkOrders } from "../../lib/api";

const maintenanceActions = [
  { id: "create-wo", label: "Create Work Order", icon: "ri-file-add-line", color: "primary" as const },
  { id: "schedule-pm", label: "Schedule PM", icon: "ri-calendar-line", color: "primary" as const },
];

export default function MaintenancePage() {
  const { data: workOrders } = useWorkOrders();
  const openWorkOrders = workOrders.filter((wo) => wo.status === "open").length;
  const inProgressWorkOrders = workOrders.filter((wo) => wo.status === "in_progress").length;
  const overdueWorkOrders = workOrders.filter(
    (wo) => wo.status === "open" && new Date(wo.dueDate) < new Date("2026-07-15")
  ).length;

  const [pinnedIds, setPinnedIds] = useState<string[]>(["total-work-orders", "overdue-tasks", "maintenance-cost", "pm-compliance"]);
  const kpis = [
    {
      id: "total-work-orders",
      title: "Total Work Orders",
      value: workOrders.length,
      change: `${inProgressWorkOrders} in progress`,
      changeType: "neutral" as const,
      icon: "ri-file-list-3-line",
      color: "secondary" as const,
    },
    {
      id: "overdue-tasks",
      title: "Overdue Tasks",
      value: overdueWorkOrders,
      change: overdueWorkOrders > 0 ? "+1" : "0",
      changeType: overdueWorkOrders > 5 ? "negative" as const : "neutral" as const,
      icon: "ri-time-line",
      color: "accent" as const,
    },
    {
      id: "maintenance-cost",
      title: "MTD Maintenance Cost",
      value: `$${Math.round(totalMaintenanceCost / 1000)}K`,
      change: "-4.2%",
      changeType: "positive" as const,
      icon: "ri-money-dollar-circle-line",
      color: "primary" as const,
    },
    {
      id: "pm-compliance",
      title: "Downtime Hours",
      value: String(Math.round(totalDowntimeHours * 10) / 10),
      change: "-8.2 hrs vs. prior",
      changeType: "positive" as const,
      icon: "ri-time-line",
      color: "primary" as const,
    },
    {
      id: "spare-parts",
      title: "Open Work Orders",
      value: openWorkOrders,
      change: "-2",
      changeType: "positive" as const,
      icon: "ri-folder-open-line",
      color: "secondary" as const,
    },
    {
      id: "crew-utilization",
      title: "Crew Utilization",
      value: "76%",
      change: "+5%",
      changeType: "positive" as const,
      icon: "ri-team-line",
      color: "secondary" as const,
    },
  ].map((k) => ({ ...k, pinned: pinnedIds.includes(k.id) }));
  const [viewMode, setViewMode] = useState("calendar");
  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [pmModalOpen, setPmModalOpen] = useState(false);

  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "create-wo":
        setWorkOrderModalOpen(true);
        break;
      case "schedule-pm":
        setPmModalOpen(true);
        break;
    }
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
          onClick: () => handleAction(a.id),
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
      <CreateWorkOrderModal open={workOrderModalOpen} onClose={() => setWorkOrderModalOpen(false)} />
      <SchedulePMModal open={pmModalOpen} onClose={() => setPmModalOpen(false)} />
    </>
  );
}
