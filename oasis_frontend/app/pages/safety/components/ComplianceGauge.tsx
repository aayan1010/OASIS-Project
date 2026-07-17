import { complianceCategories } from "../../../mocks/safety";

export default function ComplianceGauge() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Compliance Dashboard</h3>
      <div className="space-y-4">
        {complianceCategories.map((cat) => {
          const percent = cat.score;
          const isActionNeeded = cat.status === "Action Needed";
          const barColor = percent >= 95 ? "bg-primary-500" : percent >= 90 ? "bg-secondary-500" : "bg-accent-500";
          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground-700">{cat.category}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${isActionNeeded ? "text-accent-600" : "text-primary-600"}`}>
                    {cat.score}%
                  </span>
                  {isActionNeeded && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent-100 text-accent-700 font-medium">
                      Action Needed
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-background-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-foreground-400">Target: {cat.target}%</span>
                <span className="text-xs text-foreground-400">{cat.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}