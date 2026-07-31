import { useState, type FormEvent } from "react";
import { useAssets, useSites, useWorkOrders, createWorkOrder } from "../../../lib/api";

interface CreateWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
}

const technicians = [
  "Emily Chen", "Chloe Bennett", "Grace Kim", "Sarah Coyne",
  "Omar Haddad", "Brandon Lee", "Jose Martinez", "Nate Wilkerson",
  "Alicia Ferguson", "Mike Delgado",
];

const typeLabels: Record<string, string> = {
  repair: "Repair",
  preventative_maintenance: "Preventative Maintenance",
  inspection: "Inspection",
  equipment_replacement: "Equipment Replacement",
  emergency: "Emergency Repair",
  calibration: "Calibration",
};

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase();
}

export default function CreateWorkOrderModal({ open, onClose }: CreateWorkOrderModalProps) {
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
      const woType = String(formData.get("wo_type") ?? "");
      const assignee = String(formData.get("assignee") ?? "");
      const description = String(formData.get("description") ?? "");
      const dueDate = String(formData.get("due_date") ?? "");
      const estimatedHours = Number(formData.get("estimated_hours") ?? 1);
      const woNumber = `MR-${String(Date.now()).slice(-6)}`;

      await createWorkOrder({
        id: woNumber.toLowerCase(),
        woNumber,
        title: description.slice(0, 60),
        description,
        asset: assetId,
        assetId,
        status: "open",
        priority: String(formData.get("priority") ?? "medium") as "low" | "medium" | "high" | "critical",
        assignee,
        assigneeInitials: getInitials(assignee),
        dueDate,
        createdDate: new Date().toISOString().slice(0, 10),
        estimatedHours: Number.isFinite(estimatedHours) ? estimatedHours : 1,
        actualHours: 0,
        category: typeLabels[woType] ?? woType,
        tags: [typeLabels[woType] ?? woType],
      });
      await revalidate();
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Could not create the work order. Check that the backend is running and try again.");
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
            Create Work Order
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
            <p className="text-sm font-medium text-foreground-800">Work Order Created</p>
            <p className="text-xs text-foreground-500 mt-1">The work order has been logged and assigned.</p>
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
                    {a.id} — {a.name} ({a.status === "online" ? "Online" : a.status === "maintenance" ? "In Maintenance" : a.status === "degraded" ? "Degraded" : "Offline"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Work Order Type
              </label>
              <select
                name="wo_type"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select type...</option>
                <option value="repair">Repair</option>
                <option value="preventative_maintenance">Preventative Maintenance</option>
                <option value="inspection">Inspection</option>
                <option value="equipment_replacement">Equipment Replacement</option>
                <option value="emergency">Emergency Repair</option>
                <option value="calibration">Calibration</option>
              </select>
            </div>

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
                <option value="low">Low — Schedule when convenient</option>
                <option value="medium">Medium — Address within 7 days</option>
                <option value="high">High — Address within 48 hours</option>
                <option value="critical">Critical — Immediate action required</option>
              </select>
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
                    {s.id} — {s.name}
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
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimated_hours"
                min="0.5"
                step="0.5"
                placeholder="e.g. 4"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                required
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Describe the issue or scope of work..."
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
                    Creating...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-file-add-line text-sm"></i>
                    </div>
                    Create Work Order
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
