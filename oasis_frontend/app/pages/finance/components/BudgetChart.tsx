import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyBudget } from "../../../mocks/finance";

export default function BudgetChart() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Budget vs Actual (Monthly)</h3>
        <div className="flex items-center gap-3 text-xs text-foreground-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-500"></span> Budget</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500"></span> Actual</span>
        </div>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyBudget} barGap={6} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--foreground-200)/0.2)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
            <YAxis 
              tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} 
              axisLine={false} 
              tickLine={false} 
              // Cast to any to satisfy Recharts, cast to Number to satisfy the math
              tickFormatter={(v: any) => `$${(Number(v ?? 0) / 1000000).toFixed(1)}M`} 
            />
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
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="budget" name="Budget" fill="oklch(var(--secondary-400)/0.7)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="oklch(var(--primary-500))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}