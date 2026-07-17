import { hazardTypes } from "../../../mocks/safety";

export default function HazardBreakdown() {
  const maxCount = Math.max(...hazardTypes.map((h) => h.count));

  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Hazard Type Breakdown</h3>
      <div className="space-y-3">
        {hazardTypes.map((hazard, idx) => {
          const barColors = [
            "bg-accent-500", "bg-amber-500", "bg-secondary-500", "bg-primary-500",
            "bg-amber-400", "bg-accent-400", "bg-secondary-400",
          ];
          return (
            <div key={hazard.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground-700">{hazard.type}</span>
                <span className="text-xs text-foreground-500">{hazard.count} incidents ({hazard.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-background-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColors[idx % barColors.length]}`}
                  style={{ width: `${(hazard.count / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}