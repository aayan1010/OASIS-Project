"use client";

import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import MaintenanceCalendar from "./components/MaintenanceCalendar";
import KanbanBoard from "./components/KanbanBoard";
import CreateWorkOrderModal from "./components/CreateWorkOrderModal";
import SchedulePMModal from "./components/SchedulePMModal";
import { useWorkOrders, useProductionRecords } from "../../lib/api";

const maintenanceActions = [
  { id: "create-wo", label: "Create Work Order", icon: "ri-file-add-line", color: "primary" as const },
  { id: "schedule-pm", label: "Schedule PM", icon: "ri-calendar-line", color: "primary" as const },
];

export default function MaintenancePage() {
  const { data: workOrders } = useWorkOrders();
  const { data: productionRecords } = useProductionRecords();

  const openWorkOrders = workOrders.filter((wo) => wo.status === "open").length;
  const inProgressWorkOrders = workOrders.filter((wo) => wo.status === "in_progress").length;
  const overdueWorkOrders = workOrders.filter(
    (wo) => wo.status === "open" && new Date(wo.dueDate) < new Date()
  ).length;

  // Derive total downtime from production records this calendar month.
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const toDateStr = (d: unknown): string => {
    if (!d) return "";
    if (typeof d === "string") return d;
    if (typeof d === "object" && "_seconds" in (d as object))
      return new Date((d as { _seconds: number })._seconds * 1000).toISOString().slice(0, 10);
    return String(d);
  };
  const mtdDowntime = productionRecords
    .filter((r) => toDateStr(r.date).startsWith(monthPrefix))
    .reduce((s, r) => s + (r.downtime_hours ?? 0), 0);

  // Estimated MTD maintenance cost from closed/in-progress work orders (using estimatedCost field if present).
  const mtdCost = workOrders.reduce((s, wo) => s + ((wo as { estimatedCost?: number }).estimatedCost ?? 0), 0);

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
      change: overdueWorkOrders > 0 ? `${overdueWorkOrders} past due` : "None overdue",
      changeType: overdueWorkOrders > 5 ? "negative" as const : overdueWorkOrders > 0 ? "neutral" as const : "positive" as const,
      icon: "ri-time-line",
      color: "accent" as const,
    },
    {
      id: "maintenance-cost",
      title: "MTD Maintenance Cost",
      value: mtdCost > 0 ? `$${Math.round(mtdCost / 1000)}K` : "—",
      change: "-4.2%",
      changeType: "positive" as const,
      icon: "ri-money-dollar-circle-line",
      color: "primary" as const,
    },
    {
      id: "pm-compliance",
      title: "Downtime Hours (MTD)",
      value: String(Math.round(mtdDowntime * 10) / 10),
      change: `${Math.round(mtdDowntime * 10) / 10} hrs this month`,
      changeType: mtdDowntime > 50 ? "negative" as const : "positive" as const,
      icon: "ri-time-line",
      color: "primary" as const,
    },
    {
      id: "spare-parts",
      title: "Open Work Orders",
      value: openWorkOrders,
      change: `${openWorkOrders} pending`,
      changeType: openWorkOrders > 10 ? "negative" as const : "neutral" as const,
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
