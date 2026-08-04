import { useState, type FormEvent } from "react";
import { useSites, createIncident, useIncidents } from "../../../lib/api";

interface LogHazardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LogHazardModal({ open, onClose }: LogHazardModalProps) {
  const { data: sites } = useSites();
  const { revalidate } = useIncidents();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
        const honeypot = (form.elements.namedItem("company_alt") as HTMLInputElement)?.value?.trim();
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData(form);
      
      const hazardType = String(formData.get("hazard_type") ?? "");
      const riskLevel = String(formData.get("risk_level") ?? "");
      const siteId = String(formData.get("site") ?? "");
      const description = String(formData.get("description") ?? "");

      const hazardId = `HAZ-${String(Date.now()).slice(-6)}`;

      // FIXED: Removed conditional function check
      await createIncident({
        id: hazardId.toLowerCase(),
        incidentNumber: hazardId,
        type: "Hazard",
        category: hazardType,
        severity: riskLevel as "low" | "medium" | "high" | "critical",
        site: siteId,
        description: description,
        status: "open",
        dateLogged: new Date().toISOString().slice(0, 10),
      });
      
      await revalidate();

      setSubmitted(true);
      form.reset();
    } catch {
      setError("Could not log the hazard. Please check your connection and try again.");
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
            Log Hazard
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
            <p className="text-sm font-medium text-foreground-800">Hazard Logged</p>
            <p className="text-xs text-foreground-500 mt-1">The hazard has been recorded and will be reviewed.</p>
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
                Hazard Type
              </label>
              <select
                name="hazard_type"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select type...</option>
                <option value="chemical">Chemical Exposure</option>
                <option value="electrical">Electrical Hazard</option>
                <option value="mechanical">Mechanical / Moving Parts</option>
                <option value="slip-trip">Slip / Trip / Fall</option>
                <option value="fire">Fire / Explosion Risk</option>
                <option value="ergonomic">Ergonomic Hazard</option>
                <option value="noise">Noise Exposure</option>
                <option value="confined-space">Confined Space</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Risk Level
              </label>
              <select
                name="risk_level"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select risk level...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Site / Location
              </label>
              <select
                name="site"
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
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                required
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Describe the hazard and its location..."
              ></textarea>
              <p className="text-xs text-foreground-400 mt-1">Max 500 characters</p>
            </div>
            
            <div className="honeypot-wrap" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <input type="text" name="company_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
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
                    Logging...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-send-plane-line text-sm"></i>
                    </div>
                    Log Hazard
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