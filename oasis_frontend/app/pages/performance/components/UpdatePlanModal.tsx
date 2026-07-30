import { useState, type FormEvent } from "react";
import { sites } from "../../../mocks/sites";

interface UpdatePlanModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpdatePlanModal({ open, onClose }: UpdatePlanModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Update Production Plan
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
            <p className="text-sm font-medium text-foreground-800">Plan Updated</p>
            <p className="text-xs text-foreground-500 mt-1">Production targets have been updated successfully.</p>
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
                Target Daily Output (bbl/day)
              </label>
              <input
                type="number"
                name="target_output"
                required
                min={1000}
                step={100}
                placeholder="e.g. 12,500"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Effective From
                </label>
                <input
                  type="date"
                  name="effective_from"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Effective To
                </label>
                <input
                  type="date"
                  name="effective_to"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Target Efficiency (%)
              </label>
              <input
                type="number"
                name="target_efficiency"
                required
                min={50}
                max={105}
                step={0.5}
                placeholder="e.g. 97.5"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              />
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
                placeholder="Optional notes about this plan update..."
              ></textarea>
              <p className="text-xs text-foreground-400 mt-1">Max 500 characters</p>
            </div>

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
                    Updating...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-check-line text-sm"></i>
                    </div>
                    Update Plan
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