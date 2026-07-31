import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useOpexBreakdown } from "../../../lib/api";

export default function OpexBreakdown() {
  const { data: opexBreakdown } = useOpexBreakdown();
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-1">OPEX Breakdown (MTD)</h3>
      <p className="text-xs text-foreground-400 mb-4">Total: ${(opexBreakdown.reduce((sum, o) => sum + o.amount, 0) / 1000000).toFixed(2)}M</p>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-1/2 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={opexBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
              >
                {opexBreakdown.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(var(--background-50))",
                  border: "1px solid oklch(var(--background-200)/0.7)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                // Cast to any to satisfy Recharts, cast to Number to satisfy the math
                formatter={(value: any) => `$${(Number(value ?? 0) / 1000).toFixed(0)}K`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full lg:w-1/2 space-y-2">
          {opexBreakdown.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                <span className="text-foreground-700">{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground-500 text-xs">${(item.amount / 1000).toFixed(0)}K</span>
                <span className="text-foreground-400 text-xs w-8 text-right">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
