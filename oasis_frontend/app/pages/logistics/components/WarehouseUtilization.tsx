import { warehouses, deliveryPerformance } from "../../../mocks/logistics";

const whStatusColors: Record<string, string> = {
  "Operational": "bg-emerald-100 text-emerald-700",
  "Near Capacity": "bg-amber-100 text-amber-700",
};

export default function WarehouseUtilization() {
  return (
    <div className="space-y-4">
      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Warehouse Utilization</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-background-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-foreground-400">{wh.id}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${whStatusColors[wh.status]}`}>{wh.status}</span>
              </div>
              <p className="text-sm font-medium text-foreground-800 mb-1">{wh.name}</p>
              <p className="text-xs text-foreground-500 mb-3">{wh.capacity} · {wh.items} items · {wh.value}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-background-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${wh.utilization >= 90 ? "bg-accent-500" : wh.utilization >= 70 ? "bg-amber-500" : "bg-primary-500"}`}
                    style={{ width: `${wh.utilization}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-foreground-600">{wh.utilization}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Carrier Delivery Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200/70 text-left">
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Carrier</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Shipments</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">On-Time %</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Delayed</th>
                <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Lost</th>
              </tr>
            </thead>
            <tbody>
              {deliveryPerformance.map((dp) => (
                <tr key={dp.carrier} className="border-b border-background-100 hover:bg-background-100/50 transition-colors">
                  <td className="py-3 text-foreground-700 font-medium">{dp.carrier}</td>
                  <td className="py-3 text-foreground-600">{dp.total}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-background-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dp.onTime >= 90 ? "bg-emerald-500" : dp.onTime >= 85 ? "bg-amber-500" : "bg-accent-500"}`}
                          style={{ width: `${dp.onTime}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-foreground-700">{dp.onTime}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-amber-600">{dp.delayed}</td>
                  <td className="py-3 text-red-500">{dp.lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}