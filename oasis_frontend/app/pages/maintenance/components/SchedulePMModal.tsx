import { useState, type FormEvent } from "react";
import { useAssets, useSites, useWorkOrders, createWorkOrder } from "../../../lib/api";

interface SchedulePMModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the scheduled date so the calendar can jump to that month. */
  onScheduled?: (date: string) => void;
}

const technicians = [
  "Emily Chen", "Chloe Bennett", "Grace Kim", "Sarah Coyne",
  "Omar Haddad", "Brandon Lee", "Jose Martinez", "Nate Wilkerson",
  "Alicia Ferguson", "Mike Delgado",
];

const pmTypes = [
  "Lubrication & Oil Change",
  "Filter Replacement",
  "Sensor Calibration",
  "Belt & Seal Inspection",
  "Electrical System Check",
  "Pressure Test & Leak Detection",
  "Full Overhaul",
  "Corrosion Inspection",
  "Safety System Test",
  "Cooling System Flush",
];
function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase();
}

export default function SchedulePMModal({ open, onClose, onScheduled }: SchedulePMModalProps) {
  const { data: assetLocations } = useAssets();
  const { data: sites } = useSites();
  const { revalidate } = useWorkOrders();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("phone_alt") as HTMLInputElement)?.value?.trim();
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(form);
      
      const assetId = String(formData.get("asset_id") ?? "");
      const pmTypeRaw = String(formData.get("pm_type") ?? "");
      const pmTypeLabel = pmTypes.find(t => t.replace(/\s+/g, "_").toLowerCase() === pmTypeRaw) || pmTypeRaw;
      const scheduledDate = String(formData.get("scheduled_date") ?? new Date().toISOString().slice(0, 10));
      const priority = String(formData.get("priority") ?? "medium") as "low" | "medium" | "high" | "critical";
      const assignee = String(formData.get("assignee") ?? "");
      const estimatedDuration = Number(formData.get("estimated_duration") ?? 2);
      const notes = String(formData.get("notes") ?? "");

      const woNumber = `PM-${String(Date.now()).slice(-6)}`;

      // Create the work order in the system to populate the calendar
      await createWorkOrder({
        id: woNumber.toLowerCase(),
        woNumber,
        title: pmTypeLabel,
        description: notes || `Scheduled PM: ${pmTypeLabel}`,
        asset: assetId,
        assetId,
        status: "open",
        priority,
        assignee,
        assigneeInitials: getInitials(assignee),
        // The calendar schedules events by dueDate, so the chosen date drives placement.
        dueDate: scheduledDate,
        createdDate: new Date().toISOString().slice(0, 10),
        estimatedHours: Number.isFinite(estimatedDuration) ? estimatedDuration : 2,
        actualHours: 0,
        category: "Preventative Maintenance",
        tags: ["Preventative Maintenance", "PM"],
      });

      await revalidate();
      if (scheduledDate) onScheduled?.(scheduledDate);
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Could not schedule the PM. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-lg mx-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70 sticky top-0 bg-background-50 z-10">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Schedule Preventive Maintenance
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-emerald-50 mb-3">
              <i className="ri-check-line text-emerald-500 text-xl"></i>
            </div>
            <p className="text-sm font-medium text-foreground-800">PM Scheduled</p>
            <p className="text-xs text-foreground-500 mt-1">The preventive maintenance has been scheduled and added to the calendar.</p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-readdy-form className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Asset / Equipment
              </label>
              <select
                name="asset_id"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select asset...</option>
                {assetLocations.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} &mdash; {a.name} ({a.status === "online" ? "Online" : a.status === "maintenance" ? "In Maintenance" : a.status === "degraded" ? "Degraded" : "Offline"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                PM Type
              </label>
              <select
                name="pm_type"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select PM type...</option>
                {pmTypes.map((t) => (
                  <option key={t} value={t.replace(/\s+/g, "_").toLowerCase()}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduled_date"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Priority
                </label>
                <select
                  name="priority"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                >
                  <option value="">Select priority...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Recurrence
                </label>
                <select
                  name="recurrence"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                >
                  <option value="">Select recurrence...</option>
                  <option value="once">One-time only</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannual">Bi-annual</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Site
              </label>
              <select
                name="site_id"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select site...</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} &mdash; {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Assign To
              </label>
              <select
                name="assignee"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select technician...</option>
                {technicians.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Estimated Duration (hours)
              </label>
              <input
                type="number"
                name="estimated_duration"
                min="0.5"
                step="0.5"
                placeholder="e.g. 2"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Special instructions, parts needed, lockout requirements..."
              ></textarea>
              <p className="text-xs text-foreground-400 mt-1">Max 500 characters</p>
            </div>

            <div className="honeypot-wrap" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <input type="text" name="phone_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
            </div>

            {error && (
              <p className="text-xs text-accent-600 bg-accent-50 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground-600 hover:bg-background-100 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-calendar-line text-sm"></i>
                    </div>
                    Schedule PM
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
