import { safetyDrills, inspectionsData } from "../../../mocks/safety";

export default function SafetyDrills() {
  return (
    <div className="space-y-4">
      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Upcoming Safety Drills</h3>
        <div className="space-y-3">
          {safetyDrills.map((drill) => (
            <div key={drill.id} className="flex items-center justify-between p-3 bg-background-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${drill.status === "Completed" ? "bg-emerald-100" : "bg-primary-100"}`}>
                  <i className={`${drill.status === "Completed" ? "ri-check-line text-emerald-600" : "ri-calendar-line text-primary-600"} text-sm`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-800">{drill.type}</p>
                  <p className="text-xs text-foreground-500">{drill.location} · {drill.date} · {drill.participants} participants</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${drill.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-primary-100 text-primary-700"}`}>
                {drill.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Inspections Due</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200/70 text-left">
                <th className="pb-2 font-medium text-foreground-500 text-xs uppercase">ID</th>
                <th className="pb-2 font-medium text-foreground-500 text-xs uppercase">Type</th>
                <th className="pb-2 font-medium text-foreground-500 text-xs uppercase">Location</th>
                <th className="pb-2 font-medium text-foreground-500 text-xs uppercase">Due Date</th>
                <th className="pb-2 font-medium text-foreground-500 text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {inspectionsData.map((insp) => (
                <tr key={insp.id} className="border-b border-background-100">
                  <td className="py-2 font-mono text-xs text-foreground-500">{insp.id}</td>
                  <td className="py-2 text-foreground-700">{insp.type}</td>
                  <td className="py-2 text-foreground-600">{insp.location}</td>
                  <td className="py-2 text-foreground-600">{insp.dueDate}</td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      insp.status === "Overdue" ? "bg-red-100 text-red-700" : insp.status === "Due" ? "bg-accent-100 text-accent-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {insp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}