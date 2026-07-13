import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { hourlyProduction } from "../../../mocks/production";

export default function ProductionChart() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">24-Hour Production Rate</h3>
        <div className="flex items-center gap-3 text-xs text-foreground-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary-500"></span> Oil (bbl)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span> Gas (MCF)
          </span>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyProduction}>
            <defs>
              <linearGradient id="oilGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--secondary-500))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="oklch(var(--secondary-500))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--primary-500))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="oklch(var(--primary-500))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--foreground-200)/0.2)" />
            <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--background-50))",
                border: "1px solid oklch(var(--background-200)/0.7)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="oil" name="Oil (bbl)" stroke="oklch(var(--secondary-500))" fill="url(#oilGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="gas" name="Gas (MCF)" stroke="oklch(var(--primary-500))" fill="url(#gasGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}