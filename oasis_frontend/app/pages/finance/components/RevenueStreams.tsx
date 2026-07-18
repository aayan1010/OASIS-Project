import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { monthlyRevenueData } from "../../../mocks/finance";

export default function RevenueStreams() {
  const totalRevenue = monthlyRevenueData[monthlyRevenueData.length - 1];
  const total = totalRevenue ? totalRevenue.oil + totalRevenue.gas + totalRevenue.ngl + totalRevenue.condensate : 0;

  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Revenue Streams</h3>
        <span className="text-xs text-foreground-400">Jun total: ${(total / 1000000).toFixed(2)}M</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-foreground-500 mb-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-500"></span> Oil</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Gas</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500"></span> NGL</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Condensate</span>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--foreground-200)/0.2)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--background-50))",
                border: "1px solid oklch(var(--background-200)/0.7)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Area type="monotone" dataKey="oil" stroke="oklch(var(--secondary-500))" fill="oklch(var(--secondary-500)/0.1)" strokeWidth={2} />
            <Area type="monotone" dataKey="gas" stroke="#f59e0b" fill="#f59e0b15" strokeWidth={2} />
            <Area type="monotone" dataKey="ngl" stroke="oklch(var(--primary-500))" fill="oklch(var(--primary-500)/0.1)" strokeWidth={2} />
            <Area type="monotone" dataKey="condensate" stroke="#34d399" fill="#34d39915" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}