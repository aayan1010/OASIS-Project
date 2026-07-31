import { useState, type FormEvent } from "react";
import { useSites } from "../../../lib/api";

interface RunDiagnosticModalProps {
  open: boolean;
  onClose: () => void;
}

const diagnosticTypes = [
  { id: "performance", label: "Performance Check", icon: "ri-speed-up-line", desc: "CPU, memory, throughput benchmarking" },
  { id: "connectivity", label: "Connectivity Test", icon: "ri-wifi-line", desc: "Network latency, packet loss, bandwidth" },
  { id: "health", label: "Health Scan", icon: "ri-heart-pulse-line", desc: "Full system health assessment" },
  { id: "security", label: "Security Audit", icon: "ri-shield-check-line", desc: "Vulnerability scan and access review" },
];

const priorities = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const SUBMIT_ADDR = "https://readdy.ai/api/form/d9kj820h9dsfbuoi6gf0";

export default function RunDiagnosticModal({ open, onClose }: RunDiagnosticModalProps) {
  const { data: sites } = useSites();
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSite || !selectedType) return;

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const honeypot = (data.get("website_alt") as string)?.trim();
    if (honeypot) {
      setDone(true);
      setTimeout(() => resetAndClose(), 1500);
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const body = new URLSearchParams();
      for (const [k, v] of data.entries()) {
        if (k !== "website_alt" && typeof v === "string") body.append(k, v);
      }
      const res = await fetch(SUBMIT_ADDR, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const text = await res.text();
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = {}; }
      const serverMsg = parsed?.meta?.message || parsed?.message || text;

      if (res.ok && parsed?.code === "OK") {
        setDone(true);
        setTimeout(() => resetAndClose(), 1500);
      } else {
        setFormError(serverMsg || "Diagnostic request failed. Please try again.");
      }
    } catch {
      setFormError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setDone(false);
    setSelectedSite("");
    setSelectedType("");
    setPriority("medium");
    setNotes("");
    setFormError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">Run Diagnostic</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {done ? (
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-emerald-50 mb-3">
              <i className="ri-check-line text-emerald-500 text-xl"></i>
            </div>
            <p className="text-sm font-medium text-foreground-800">Diagnostic Launched</p>
            <p className="text-xs text-foreground-500 mt-1">
              {diagnosticTypes.find((t) => t.id === selectedType)?.label} started on {sites.find((s) => s.id === selectedSite)?.name}.
            </p>
          </div>
        ) : (
          <form data-readdy-form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">Site</label>
              <select
                name="site"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select site...</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">Diagnostic Type</label>
              <div className="grid grid-cols-2 gap-2">
                {diagnosticTypes.map((dt) => (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => setSelectedType(dt.id)}
                    className={`flex flex-col items-start gap-0.5 p-3 rounded-md text-left transition-colors ${
                      selectedType === dt.id
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className={`${dt.icon} text-xs`}></i>
                      </div>
                      <span className="text-xs font-medium">{dt.label}</span>
                    </div>
                    <span className={`text-[10px] leading-tight ${selectedType === dt.id ? "text-background-50/80" : "text-foreground-400"}`}>
                      {dt.desc}
                    </span>
                  </button>
                ))}
              </div>
              <input type="hidden" name="diagnostic_type" value={selectedType} />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      priority === p.id
                        ? "bg-secondary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="priority" value={priority} />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5" htmlFor="diag-notes">Notes</label>
              <textarea
                id="diag-notes"
                name="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Optional details or instructions..."
              />
            </div>

            <input
              type="text"
              name="website_alt"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              readOnly
              className="absolute opacity-0 pointer-events-none"
            />

            {formError && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-md">{formError}</p>
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
                disabled={submitting || !selectedSite || !selectedType}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                    Running...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-stethoscope-line text-sm"></i>
                    </div>
                    Start Diagnostic
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
