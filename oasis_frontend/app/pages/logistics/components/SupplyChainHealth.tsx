import { supplyChainAlerts } from "../../../mocks/logistics";

const riskColors: Record<string, string> = {
  "High": "bg-red-100 text-red-700 border-red-200",
  "Medium": "bg-amber-100 text-amber-700 border-amber-200",
  "Low": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function SupplyChainHealth() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Supply Chain Risk Alerts</h3>
        <span className="text-xs text-foreground-400">{supplyChainAlerts.filter((a) => a.risk === "High").length} high risk</span>
      </div>
      <div className="space-y-3">
        {supplyChainAlerts.map((alert) => (
          <div key={alert.id} className={`rounded-lg border p-4 ${riskColors[alert.risk]} bg-opacity-50`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground-800">{alert.item}</p>
                <p className="text-xs text-foreground-500">Supplier: {alert.supplier} · Lead time: {alert.leadTime}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColors[alert.risk]}`}>
                {alert.risk} Risk
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-foreground-500">Status: <span className="text-foreground-700 font-medium">{alert.currentStatus}</span></span>
              <span className="text-primary-600 font-medium">{alert.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}