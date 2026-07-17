import TopOverview from "../../components/feature/TopOverview";
import { useState } from "react";
import IncidentTrendChart from "./components/IncidentTrendChart";
import IncidentsTable from "./components/IncidentsTable";
import ComplianceGauge from "./components/ComplianceGauge";
import HazardBreakdown from "./components/HazardBreakdown";
import SafetyDrills from "./components/SafetyDrills";

const safetyKpis = [
  {
    id: "days-safe",
    title: "Days Without Incident",
    value: 142,
    change: "Record high",
    changeType: "positive" as const,
    icon: "ri-shield-check-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "incidents-mtd",
    title: "Incidents (MTD)",
    value: 2,
    change: "-1",
    changeType: "positive" as const,
    icon: "ri-first-aid-kit-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "compliance-score",
    title: "Compliance Score",
    value: "96%",
    change: "+2%",
    changeType: "positive" as const,
    icon: "ri-check-double-line",
    color: "primary" as const,
    pinned: true,
  },
  {
    id: "hazards-open",
    title: "Open Hazards",
    value: 7,
    change: "+2",
    changeType: "negative" as const,
    icon: "ri-alert-line",
    color: "accent" as const,
    pinned: true,
  },
  {
    id: "inspections-due",
    title: "Inspections Due",
    value: 4,
    change: "0",
    changeType: "neutral" as const,
    icon: "ri-calendar-check-line",
    color: "secondary" as const,
    pinned: false,
  },
  {
    id: "training-compliance",
    title: "Training Compliance",
    value: "94%",
    change: "+3%",
    changeType: "positive" as const,
    icon: "ri-graduation-cap-line",
    color: "secondary" as const,
    pinned: false,
  },
];

const safetyActions = [
  { id: "report-incident", label: "Report Incident", icon: "ri-alert-line", color: "accent" as const },
  { id: "log-hazard", label: "Log Hazard", icon: "ri-error-warning-line", color: "primary" as const },
  { id: "schedule-drill", label: "Schedule Drill", icon: "ri-calendar-line", color: "secondary" as const },
];

export default function SafetyPage() {
  const [kpis, setKpis] = useState(safetyKpis);
  const [viewMode, setViewMode] = useState("incidents");

  const handleTogglePin = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, pinned: !k.pinned } : k))
    );
  };

  return (
    <>
      <TopOverview
        title="Safety"
        subtitle="Incident tracking, hazard management, and compliance monitoring"
        kpis={kpis}
        onTogglePin={handleTogglePin}
        quickActions={safetyActions.map((a) => ({
          ...a,
          onClick: () => console.log(a.id),
        }))}
        viewToggle={{
          options: [
            { id: "incidents", label: "Incident Dashboard", icon: "ri-alert-line" },
            { id: "compliance", label: "Compliance & Audit", icon: "ri-check-double-line" },
          ],
          activeView: viewMode,
          onChange: setViewMode,
        }}
      />

      <div className="px-6 py-6">
        {viewMode === "incidents" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-background-50 rounded-lg border border-background-200/70 p-5 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-xs text-foreground-400 uppercase tracking-wide mb-2">Days Without Incident</p>
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-3">
                    <span className="text-3xl font-heading font-bold text-primary-600">142</span>
                  </div>
                  <p className="text-xs text-foreground-500">Record: 205 days (Q1 2025)</p>
                  <div className="mt-3 flex items-center justify-center gap-6 text-xs">
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">2</p>
                      <p className="text-foreground-400">Incidents (MTD)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">8</p>
                      <p className="text-foreground-400">Near Misses (MTD)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-heading font-semibold text-foreground-900">96%</p>
                      <p className="text-foreground-400">Compliance</p>
                    </div>
                  </div>
                </div>
              </div>
              <IncidentTrendChart />
            </div>
            <IncidentsTable />
            <HazardBreakdown />
          </div>
        ) : (
          <div className="space-y-4">
            <ComplianceGauge />
            <SafetyDrills />
          </div>
        )}
      </div>
    </>
  );
}