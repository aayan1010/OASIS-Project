import { useState, type FormEvent } from "react";
import { sites } from "../../../mocks/sites";

interface CreateReportModalProps {
  open: boolean;
  onClose: () => void;
}

const reportTypes = [
  { id: "daily", label: "Daily Production Report" },
  { id: "weekly", label: "Weekly Summary" },
  { id: "monthly", label: "Monthly Performance Review" },
  { id: "efficiency", label: "Efficiency Analysis" },
  { id: "downtime", label: "Downtime Impact Report" },
];

const dateRanges = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "custom", label: "Custom range" },
];

export default function CreateReportModal({ open, onClose }: CreateReportModalProps) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedRange, setSelectedRange] = useState("7d");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setSelectedType("");
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Create Report
          </h2>
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
            <p className="text-sm font-medium text-foreground-800">Report Generated</p>
            <p className="text-xs text-foreground-500 mt-1">
              {reportTypes.find((t) => t.id === selectedType)?.label} is ready for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="">Select report type...</option>
                {reportTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>{rt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Site / Scope
              </label>
              <select
                name="site"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors"
              >
                <option value="all">All Sites</option>
                {sites.filter((s) => s.status === "Active").map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.id} — {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Period
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dateRanges.map((dr) => (
                  <button
                    key={dr.id}
                    type="button"
                    onClick={() => setSelectedRange(dr.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedRange === dr.id
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    {dr.label}
                  </button>
                ))}
              </div>
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
                disabled={generating || !selectedType}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                    Generating...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-flashlight-line text-sm"></i>
                    </div>
                    Generate Report
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