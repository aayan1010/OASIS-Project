import { inventoryItems } from "../../../mocks/logistics";

const statusStyles: Record<string, string> = {
  "Adequate": "border-emerald-200 bg-emerald-50",
  "Low Stock": "border-amber-200 bg-amber-50",
};

const statusDot: Record<string, string> = {
  "Adequate": "bg-emerald-500",
  "Low Stock": "bg-amber-500",
};

export default function InventoryStatus() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Inventory Status</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adequate</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Low Stock</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {inventoryItems.map((item) => {
          const fillPercent = (item.quantity / (item.reorderPoint * 2)) * 100;
          return (
            <div key={item.id} className={`rounded-lg border p-4 ${statusStyles[item.status]} transition-colors hover:shadow-sm cursor-pointer`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-background-50 text-foreground-500 font-medium">{item.category}</span>
                <span className={`w-2 h-2 rounded-full ${statusDot[item.status]}`}></span>
              </div>
              <p className="text-sm font-medium text-foreground-800 mb-2 line-clamp-2">{item.name}</p>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-heading font-semibold text-foreground-900">
                  {item.quantity.toLocaleString()}
                  <span className="text-xs text-foreground-400 ml-1">{item.unit}</span>
                </span>
                <span className="text-xs text-foreground-400">RO: {item.reorderPoint}</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-background-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${item.status === "Low Stock" ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(fillPercent, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-foreground-400 mt-2">{item.location} · Last ordered {item.lastOrdered}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}