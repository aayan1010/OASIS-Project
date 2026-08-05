"use client";

import { useState } from "react";
import { safetyIncidents } from "../../../mocks/safety";
import { useIncidents, type IncidentRecord } from "../../../lib/api";

const severityColors: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700",
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-emerald-100 text-emerald-700",
};

const statusColors: Record<string, string> = {
  "Open": "bg-accent-100 text-accent-700",
  "Closed": "bg-emerald-100 text-emerald-700",
  "Under Review": "bg-amber-100 text-amber-700",
};

type DisplayIncident = {
  id: string;
  type: string;
  severity: string;
  location: string;
  date: string;
  status: string;
  description: string;
  sector: string;
  reportedBy: string;
  daysToResolve: number | null;
};

const categoryLabels: Record<string, string> = {
  safety: "Safety Incident",
  equipment: "Equipment Failure",
  environmental: "Environmental Spill",
  security: "Security Breach",
  process: "Process Upset",
  other: "Other",
};

const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Map an incident created via the Report Incident modal into the table's display shape.
function normalizeReported(inc: IncidentRecord): DisplayIncident {
  return {
    id: inc.incidentNumber || inc.id,
    type: categoryLabels[inc.category] ?? titleCase(inc.category) ?? inc.type,
    severity: titleCase(inc.severity),
    location: inc.site,
    date: inc.dateLogged,
    status: inc.status === "open" ? "Open" : titleCase(inc.status),
    description: inc.description,
    sector: inc.site,
    reportedBy: "You",
    daysToResolve: null,
  };
}

export default function IncidentsTable() {
  const { data: reportedIncidents } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");

  // Newly reported incidents appear first, followed by the seeded incidents.
  const allIncidents: DisplayIncident[] = [
    ...reportedIncidents.map(normalizeReported),
    ...(safetyIncidents as DisplayIncident[]),
  ];

  const types = ["All", ...Array.from(new Set(allIncidents.map((i) => i.type)))];
  const filtered = filterType === "All" ? allIncidents : allIncidents.filter((i) => i.type === filterType);

  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Recent Incidents</h3>
        <div className="flex items-center gap-1 bg-background-200/70 rounded-full p-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filterType === t ? "bg-background-50 text-foreground-900 shadow-sm" : "text-foreground-500 hover:text-foreground-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background-200/70 text-left">
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">ID</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">Type</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">Severity</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">Location</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">Date</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
                className="border-b border-background-100 hover:bg-background-100/50 cursor-pointer transition-colors"
              >
                <td className="py-3 font-mono text-xs text-foreground-600">{incident.id}</td>
                <td className="py-3 text-foreground-700">{incident.type}</td>
                <td className="py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[incident.severity]}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="py-3 text-foreground-600">{incident.location}</td>
                <td className="py-3 text-foreground-500">{incident.date}</td>
                <td className="py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
                    {incident.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIncident && (() => {
        const inc = allIncidents.find((i) => i.id === selectedIncident);
        if (!inc) return null;
        return (
          <div className="mt-4 p-4 bg-background-100 rounded-lg border border-background-200/50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-mono text-foreground-500">{inc.id}</span>
                <h4 className="text-sm font-medium text-foreground-900 mt-1">{inc.description}</h4>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="w-6 h-6 flex items-center justify-center text-foreground-400 hover:text-foreground-600">
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-foreground-500">
              <div><span className="text-foreground-400">Sector:</span> <span className="text-foreground-700 ml-1">{inc.sector}</span></div>
              <div><span className="text-foreground-400">Reported by:</span> <span className="text-foreground-700 ml-1">{inc.reportedBy}</span></div>
              <div><span className="text-foreground-400">Days to resolve:</span> <span className="text-foreground-700 ml-1">{inc.daysToResolve ?? "N/A"}</span></div>
              <div><span className="text-foreground-400">Status:</span> <span className={`ml-1 font-medium ${inc.status === "Closed" ? "text-emerald-600" : inc.status === "Under Review" ? "text-amber-600" : "text-accent-600"}`}>{inc.status}</span></div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
