import { throughputByAsset } from "../../../mocks/production";

const statusColors: Record<string, string> = {
  "Normal": "bg-emerald-100 text-emerald-700",
  "Degraded": "bg-amber-100 text-amber-700",
};

const typeIcons: Record<string, string> = {
  "Oil": "ri-drop-fill",
  "Gas": "ri-fire-fill",
};

const typeColors: Record<string, string> = {
  "Oil": "text-secondary-500",
  "Gas": "text-accent-500",
};

export default function ThroughputCards() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Asset Throughput</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {throughputByAsset.map((asset) => (
          <div key={asset.asset} className="bg-background-100 rounded-lg p-4 hover:bg-background-200/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-full bg-background-50 flex items-center justify-center`}>
                <i className={`${typeIcons[asset.type]} ${typeColors[asset.type]} text-sm`}></i>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[asset.status]}`}>
                {asset.status}
              </span>
            </div>
            <p className="text-xs text-foreground-500 mb-1 truncate">{asset.asset}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-heading font-semibold text-foreground-900">{asset.throughput.toLocaleString()}</span>
              <span className="text-xs text-foreground-400">{asset.unit}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-background-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${asset.efficiency >= 90 ? "bg-primary-500" : asset.efficiency >= 80 ? "bg-amber-500" : "bg-accent-500"}`}
                  style={{ width: `${asset.efficiency}%` }}
                ></div>
              </div>
              <span className="text-xs text-foreground-400">{asset.efficiency}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}