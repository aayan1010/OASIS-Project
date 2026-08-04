import { useCostPerUnit, useCapexProjects } from "../../../lib/api";

const projectStatusColors: Record<string, string> = {
  "On Track": "bg-emerald-100 text-emerald-700",
  "Over Budget": "bg-accent-100 text-accent-700",
};

export default function CostMetrics() {
  const { data: costPerUnit } = useCostPerUnit();
  const { data: capexProjects } = useCapexProjects();
  return (
    <div className="space-y-4">
      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Cost Per Unit by Asset</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200/70 text-left">
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Asset</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Actual</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Target</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Unit</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Variance</th>
              </tr>
            </thead>
            <tbody>
              {costPerUnit.map((cpu) => {
                // Extract raw values and safely cast to Number
                const rawCost = "liftingCost" in cpu ? cpu.liftingCost : cpu.opsCost;
                const cost = Number(rawCost ?? 0);
                const target = Number(cpu.target ?? 0);
                
                // Safely calculate variance, avoiding division by zero
                const variance = target === 0 ? 0 : ((cost - target) / target) * 100;
                const overBudget = variance > 0;
                
                return (
                  <tr key={cpu.asset} className="border-b border-background-100 hover:bg-background-100/50 transition-colors">
                    <td className="py-3 text-foreground-700 font-medium">{cpu.asset}</td>
                    <td className="py-3 text-foreground-800 font-mono">${cost.toFixed(2)}</td>
                    <td className="py-3 text-foreground-500">${target.toFixed(2)}</td>
                    <td className="py-3 text-foreground-500">{cpu.unit}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${overBudget ? "text-accent-600" : "text-emerald-600"}`}>
                        {overBudget ? "+" : ""}{variance.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">CAPEX Projects (YTD)</h3>
        <div className="space-y-3">
          {capexProjects.map((proj) => (
            <div key={proj.id} className="bg-background-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground-800">{proj.name}</p>
                  <p className="text-xs text-foreground-500">{proj.category} · Est. completion: {proj.expectedCompletion}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${projectStatusColors[proj.status]}`}>
                  {proj.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-2 bg-background-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${proj.status === "Over Budget" ? "bg-accent-500" : "bg-primary-500"}`}
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-foreground-500 w-8 text-right">{proj.progress}%</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-foreground-500">Spent: <span className="text-foreground-700 font-medium">${(proj.spent / 1000).toFixed(0)}K</span></span>
                <span className="text-foreground-500">Budget: <span className="text-foreground-700 font-medium">${(proj.budget / 1000).toFixed(0)}K</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
