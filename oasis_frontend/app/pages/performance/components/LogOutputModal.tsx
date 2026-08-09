import { useState, type FormEvent } from "react";
import { sites } from "../../../mocks/sites";
import { createProductionRecord, type ProductionDailyRecord } from "../../../lib/api";

interface LogOutputModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (record: ProductionDailyRecord) => void;
}

export default function LogOutputModal({ open, onClose, onSaved }: LogOutputModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const actual = Number(form.get("actual_output"));
    const planned = Number(form.get("planned_target"));
    const record: Omit<ProductionDailyRecord, "id"> = {
      site_id: form.get("site") as string,
      date: form.get("production_date") as string,
      actual_production: actual,
      production_target: planned,
      efficiency_percentage: planned > 0 ? Math.round((actual / planned) * 1000) / 10 : 0,
      downtime_hours: Number(form.get("downtime_hours")) || 0,
      energy_used_kwh: Number(form.get("energy_used")) || 0,
    };
    setLoading(true);
    setError(null);
    try {
      const saved = await createProductionRecord(record);
      onSaved?.(saved);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error("Failed to log production output:", err);
      setError("Could not save the output. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Log Production Output
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
            <p className="text-sm font-medium text-foreground-800">Output Logged</p>
            <p className="text-xs text-foreground-500 mt-1">Daily production output has been recorded.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Site
              </label>
              <select
                name="site"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select site...</option>
                {sites.filter((s) => s.status === "Active").map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.id} — {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Production Date
              </label>
              <input
                type="date"
                name="production_date"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Actual Output (bbl/day)
                </label>
                <input
                  type="number"
                  name="actual_output"
                  required
                  min={0}
                  step={50}
                  placeholder="e.g. 3,850"
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Planned Target (bbl/day)
                </label>
                <input
                  type="number"
                  name="planned_target"
                  required
                  min={0}
                  step={50}
                  placeholder="e.g. 4,000"
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Downtime (hours)
                </label>
                <input
                  type="number"
                  name="downtime_hours"
                  min={0}
                  max={24}
                  step={0.5}
                  defaultValue={0}
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Energy Used (MWh)
                </label>
                <input
                  type="number"
                  name="energy_used"
                  min={0}
                  step={50}
                  placeholder="e.g. 4,100"
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Any observations, issues, or remarks..."
              ></textarea>
              <p className="text-xs text-foreground-400 mt-1">Max 500 characters</p>
            </div>

            {error && (
              <p className="text-xs text-accent-600 bg-accent-50 border border-accent-200/70 rounded-md px-3 py-2">
                {error}
              </p>
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
                    Logging...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-save-line text-sm"></i>
                    </div>
                    Log Output
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
