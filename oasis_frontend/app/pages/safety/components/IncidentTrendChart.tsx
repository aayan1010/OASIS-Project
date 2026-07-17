import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { monthlyIncidents } from "../../../mocks/safety";

export default function IncidentTrendChart() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Incident Trends (6 Months)</h3>
        <div className="flex items-center gap-3 text-xs text-foreground-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-500"></span> Incidents
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Near Misses
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary-400"></span> Hazards
          </span>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyIncidents} barGap={2} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--foreground-200)/0.3)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--background-50))",
                border: "1px solid oklch(var(--background-200)/0.7)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="incidents" name="Incidents" fill="oklch(var(--accent-500))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="nearMisses" name="Near Misses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="hazards" name="Hazards" fill="oklch(var(--secondary-400))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}