import { downtimeEvents } from "../../../mocks/production";

const statusColors: Record<string, string> = {
  "Resolved": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-amber-100 text-amber-700",
};

export default function DowntimeLog() {
  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground-900">Downtime Events</h3>
        <span className="text-xs text-foreground-400">This week</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background-200/70 text-left">
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Asset</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Start Time</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Duration</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Reason</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Impact</th>
              <th className="pb-3 font-medium text-foreground-500 text-xs uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {downtimeEvents.map((event) => (
              <tr key={event.id} className="border-b border-background-100 hover:bg-background-100/50 transition-colors">
                <td className="py-3 text-foreground-700 font-medium">{event.asset}</td>
                <td className="py-3 text-foreground-600">{event.startTime}</td>
                <td className="py-3 text-foreground-600">{event.duration}</td>
                <td className="py-3 text-foreground-600">{event.reason}</td>
                <td className="py-3 text-accent-600 font-medium">{event.impact}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}