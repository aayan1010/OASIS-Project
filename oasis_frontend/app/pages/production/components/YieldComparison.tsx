import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { dailyYieldComparison } from "../../../mocks/production";

export default function YieldComparison() {
  const avgActual = Math.round(dailyYieldComparison.reduce((sum, d) => sum + d.actual, 0) / dailyYieldComparison.length);

  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Yield vs Target (7 Days)</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-foreground-500">Avg: <strong className="text-foreground-900">{avgActual.toLocaleString()}</strong> bbl/day</span>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyYieldComparison} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--foreground-200)/0.2)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} domain={[11000, 13500]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--background-50))",
                border: "1px solid oklch(var(--background-200)/0.7)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <ReferenceLine y={12800} stroke="oklch(var(--foreground-300))" strokeDasharray="5 5" label={{ value: "Target", position: "right", fontSize: 11, fill: "oklch(var(--foreground-400))" }} />
            <Bar dataKey="actual" name="Actual" fill="oklch(var(--primary-500))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target" fill="oklch(var(--foreground-200)/0.5)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}