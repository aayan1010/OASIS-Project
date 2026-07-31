import { useState, type FormEvent } from "react";
import { useSites } from "../../../lib/api";

interface ScheduleDrillModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ScheduleDrillModal({ open, onClose }: ScheduleDrillModalProps) {
  const { data: sites } = useSites();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("mobile_alt") as HTMLInputElement)?.value?.trim();
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(form);
      formData.delete("mobile_alt");
      const res = await fetch("https://readdy.ai/api/form/d9kirf6c26n1c7c5qj40", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      const text = await res.text();
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(text); } catch { /* raw text fallback */ }
      const code = (parsed as { code?: string })?.code;
      if (res.ok && code === "OK") {
        setSubmitted(true);
        form.reset();
      } else {
        const msg = (parsed as { meta?: { message?: string } })?.meta?.message
          || (parsed as { message?: string })?.message
          || text
          || "Submission failed. Please try again.";
        setError(msg.includes("spam") ? "Submission could not be processed." : String(msg));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-lg mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Schedule Safety Drill
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
            <p className="text-sm font-medium text-foreground-800">Drill Scheduled</p>
            <p className="text-xs text-foreground-500 mt-1">The safety drill has been scheduled successfully.</p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-secondary-500 text-background-50 hover:bg-secondary-600 transition-colors whitespace-nowrap"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-readdy-form className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Drill Type
              </label>
              <select
                name="drill_type"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors"
              >
                <option value="">Select drill type...</option>
                <option value="fire-evacuation">Fire Evacuation</option>
                <option value="hazmat-spill">Hazmat Spill Response</option>
                <option value="confined-space">Confined Space Rescue</option>
                <option value="medical-emergency">Medical Emergency</option>
                <option value="active-shooter">Active Threat / Lockdown</option>
                <option value="equipment-shutdown">Emergency Equipment Shutdown</option>
                <option value="earthquake">Earthquake / Natural Disaster</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="drill_date"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                  Time
                </label>
                <input
                  type="time"
                  name="drill_time"
                  required
                  className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Site
              </label>
              <select
                name="site"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors"
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
                Estimated Participants
              </label>
              <input
                type="number"
                name="participants"
                min={1}
                required
                placeholder="e.g. 45"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors"
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
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-secondary-300 transition-colors resize-none"
                placeholder="Any special instructions or scenario details..."
              ></textarea>
              <p className="text-xs text-foreground-400 mt-1">Max 500 characters</p>
            </div>

            <div className="honeypot-wrap" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <input type="text" name="mobile_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-secondary-500 text-background-50 hover:bg-secondary-600 transition-colors whitespace-nowrap disabled:opacity-50"
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
                      <i className="ri-calendar-check-line text-sm"></i>
                    </div>
                    Schedule Drill
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
