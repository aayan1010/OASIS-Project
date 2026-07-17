import { shipments } from "../../../mocks/logistics";

const statusColors: Record<string, string> = {
  "Delivered": "bg-emerald-100 text-emerald-700",
  "In Transit": "bg-primary-100 text-primary-700",
  "Out for Delivery": "bg-secondary-100 text-secondary-700",
  "Processing": "bg-amber-100 text-amber-700",
};

export default function ShipmentTracker() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Shipment Tracking</h3>
      <div className="space-y-3">
        {shipments.map((ship) => (
          <div key={ship.id} className="bg-background-100 rounded-lg p-4 hover:bg-background-200/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-foreground-500">{ship.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[ship.status]}`}>{ship.status}</span>
                </div>
                <p className="text-sm text-foreground-700">
                  <span className="text-foreground-500">{ship.origin}</span>
                  <i className="ri-arrow-right-line mx-2 text-foreground-300"></i>
                  <span className="text-foreground-800">{ship.destination}</span>
                </p>
              </div>
              <span className="text-xs text-foreground-400 whitespace-nowrap">ETA: {ship.eta}</span>
            </div>

            <div className="w-full h-2 bg-background-200/70 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${ship.progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-foreground-500">
              <span>{ship.carrier} · {ship.items} items · {ship.weight}</span>
              <span>{ship.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}