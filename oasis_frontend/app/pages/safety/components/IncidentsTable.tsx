import { useState } from "react";
import { safetyIncidents } from "../../../mocks/safety";

const severityColors: Record<string, string> = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-emerald-100 text-emerald-700",
};

const statusColors: Record<string, string> = {
  "Open": "bg-accent-100 text-accent-700",
  "Closed": "bg-emerald-100 text-emerald-700",
  "Under Review": "bg-amber-100 text-amber-700",
};

export default function IncidentsTable() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");

  const types = ["All", ...Array.from(new Set(safetyIncidents.map((i) => i.type)))];
  const filtered = filterType === "All" ? safetyIncidents : safetyIncidents.filter((i) => i.type === filterType);

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
        const inc = safetyIncidents.find((i) => i.id === selectedIncident);
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