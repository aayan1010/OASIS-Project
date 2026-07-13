import { useState, useRef, useEffect } from "react";

export interface AlertThreshold {
  warning: number;
  critical: number;
  direction: "below" | "above";
  enabled: boolean;
}

interface ThresholdSettingsProps {
  thresholds: AlertThreshold;
  onChange: (t: AlertThreshold) => void;
  kpiValue: string | number;
  kpiTitle: string;
}

function parseNumericValue(val: string | number): number {
  if (typeof val === "number") return val;
  let cleaned = val.replace(/[$,%\s]/g, "").replace(/,/g, "");
  const suffixMatch = cleaned.match(/^([\d.]+)([MKB])$/i);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1]);
    const suffix = suffixMatch[2].toUpperCase();
    if (suffix === "M") return num * 1_000_000;
    if (suffix === "B") return num * 1_000_000_000;
    if (suffix === "K") return num * 1_000;
    return num;
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function getThresholdStatus(
  current: number,
  thresholds: AlertThreshold
): "ok" | "warning" | "critical" {
  if (!thresholds.enabled) return "ok";
  const { warning, critical, direction } = thresholds;
  if (direction === "below") {
    if (current <= critical) return "critical";
    if (current <= warning) return "warning";
    return "ok";
  }
  if (current >= critical) return "critical";
  if (current >= warning) return "warning";
  return "ok";
}

export { getThresholdStatus, parseNumericValue };

export default function ThresholdSettings({
  thresholds,
  onChange,
  kpiValue,
  kpiTitle,
}: ThresholdSettingsProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AlertThreshold>({ ...thresholds });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft({ ...thresholds });
  }, [thresholds]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const current = parseNumericValue(kpiValue);
  const status = getThresholdStatus(current, thresholds);

  const statusColors = {
    ok: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  };

  const statusLabels = {
    ok: "OK",
    warning: "Warning",
    critical: "Critical",
  };

  const handleSave = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        className="w-6 h-6 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-200/70 transition-colors"
        title="Threshold Settings"
      >
        <i className="ri-settings-3-line text-sm"></i>
      </button>

      {thresholds.enabled && (
        <span
          className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-background-50 ${statusColors[status]}`}
        ></span>
      )}

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-background-50 rounded-lg border border-background-200/70 shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-semibold text-foreground-900 uppercase tracking-wider">
              Alert Thresholds
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded text-foreground-400 hover:text-foreground-600"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>

          <p className="text-xs text-foreground-500 mb-3">
            {kpiTitle} &mdash; Current:{" "}
            <span className="font-medium text-foreground-900">{kpiValue}</span>
          </p>

          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, enabled: e.target.checked }))
                }
                className="w-3.5 h-3.5 rounded border-background-300 text-primary-500 focus:ring-2 focus:ring-primary-400"
              />
              <span className="text-xs text-foreground-700">Enable thresholds</span>
            </label>
          </div>

          {draft.enabled && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs text-foreground-700 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0"></span>
                  Warning
                </span>
                <input
                  type="number"
                  value={draft.warning}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      warning: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1 text-xs border border-background-200/70 rounded-md bg-background-50 text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs text-foreground-700 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0"></span>
                  Critical
                </span>
                <input
                  type="number"
                  value={draft.critical}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      critical: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1 text-xs border border-background-200/70 rounded-md bg-background-50 text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-foreground-600">Trigger when value is</span>
                <div className="flex items-center bg-background-200/70 rounded-full p-0.5">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, direction: "below" }))}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      draft.direction === "below"
                        ? "bg-background-50 text-foreground-900 shadow-sm"
                        : "text-foreground-500 hover:text-foreground-700"
                    }`}
                  >
                    Below
                  </button>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, direction: "above" }))}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      draft.direction === "above"
                        ? "bg-background-50 text-foreground-900 shadow-sm"
                        : "text-foreground-500 hover:text-foreground-700"
                    }`}
                  >
                    Above
                  </button>
                </div>
              </div>

              <div
                className={`text-xs px-2.5 py-1.5 rounded-md mb-3 ${
                  status === "ok"
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "warning"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                }`}
              >
                Current status: <span className="font-semibold">{statusLabels[status]}</span>
              </div>
            </>
          )}

          <button
            onClick={handleSave}
            className="w-full px-3 py-1.5 bg-primary-500 text-background-50 text-xs font-medium rounded-md hover:bg-primary-600 transition-colors whitespace-nowrap"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}