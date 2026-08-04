import { useState, useEffect, useRef } from "react";
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

type StepStatus = "pending" | "running" | "success" | "warning" | "error";

interface DiagnosticStep {
  id: string;
  label: string;
  desc: string;
  status: StepStatus;
  result?: string;
  value?: string;
}

function buildSteps(type: string): DiagnosticStep[] {
  switch (type) {
    case "performance":
      return [
        { id: "cpu", label: "CPU Load Test", desc: "Stress-testing processor cores", status: "pending" },
        { id: "memory", label: "Memory Bandwidth", desc: "Measuring read/write throughput", status: "pending" },
        { id: "disk", label: "Disk I/O", desc: "Sequential & random access benchmarks", status: "pending" },
        { id: "throughput", label: "Throughput Analysis", desc: "End-to-end request handling capacity", status: "pending" },
        { id: "summary", label: "Performance Summary", desc: "Aggregating results", status: "pending" },
      ];
    case "connectivity":
      return [
        { id: "latency", label: "Latency Check", desc: "Measuring round-trip time to endpoints", status: "pending" },
        { id: "packet-loss", label: "Packet Loss", desc: "Testing data integrity over network", status: "pending" },
        { id: "bandwidth", label: "Bandwidth Test", desc: "Measuring upload/download capacity", status: "pending" },
        { id: "dns", label: "DNS Resolution", desc: "Verifying name resolution speed", status: "pending" },
        { id: "summary", label: "Connectivity Summary", desc: "Aggregating results", status: "pending" },
      ];
    case "health":
      return [
        { id: "sensors", label: "Sensor Calibration", desc: "Verifying all sensor readings", status: "pending" },
        { id: "controllers", label: "Controller Status", desc: "Checking PLC & SCADA health", status: "pending" },
        { id: "actuators", label: "Actuator Response", desc: "Testing valve & motor responsiveness", status: "pending" },
        { id: "alarms", label: "Alarm System", desc: "Validating alert routing & escalation", status: "pending" },
        { id: "summary", label: "Health Summary", desc: "Aggregating results", status: "pending" },
      ];
    case "security":
      return [
        { id: "access", label: "Access Control Audit", desc: "Reviewing user permissions & roles", status: "pending" },
        { id: "vuln", label: "Vulnerability Scan", desc: "Scanning for known CVE exposures", status: "pending" },
        { id: "firewall", label: "Firewall Rules", desc: "Validating network segmentation", status: "pending" },
        { id: "audit-log", label: "Audit Log Review", desc: "Checking for anomalous access patterns", status: "pending" },
        { id: "summary", label: "Security Summary", desc: "Aggregating results", status: "pending" },
      ];
    default:
      return [];
  }
}

function getOverallStatus(steps: DiagnosticStep[]): StepStatus {
  if (steps.some((s) => s.status === "error")) return "error";
  if (steps.some((s) => s.status === "warning")) return "warning";
  if (steps.every((s) => s.status === "success")) return "success";
  return "pending";
}

export default function RunDiagnosticModal({ open, onClose }: RunDiagnosticModalProps) {
  const { data: sites } = useSites();
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [phase, setPhase] = useState<"config" | "running" | "done">("config");
  const [steps, setSteps] = useState<DiagnosticStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "running" && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 200);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, startTime]);

  const startDiagnostic = () => {
    if (!selectedSite || !selectedType) return;
    const diagnosticSteps = buildSteps(selectedType);
    setSteps(diagnosticSteps.map((s) => ({ ...s, status: "pending" })));
    setProgress(0);
    setPhase("running");
    setStartTime(Date.now());
    setElapsed(0);

    const nonSummarySteps = diagnosticSteps.filter((s) => s.id !== "summary");
    const totalSteps = nonSummarySteps.length + 1; // +1 for summary
    let stepIndex = 0;

    const runNext = () => {
      if (stepIndex >= nonSummarySteps.length) {
        runSummary();
        return;
      }

      const step = nonSummarySteps[stepIndex];
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: "running" } : s))
      );
      setProgress(Math.round(((stepIndex) / totalSteps) * 100));

      const delay = 900 + Math.random() * 2200;
      setTimeout(() => {
        const outcomes: { status: StepStatus; result: string; value: string }[] = [
          { status: "success", result: "Optimal", value: genValue(step.id) },
          { status: "success", result: "Optimal", value: genValue(step.id) },
          { status: "warning", result: "Degraded", value: genWarnValue(step.id) },
          { status: "success", result: "Optimal", value: genValue(step.id) },
        ];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

        setSteps((prev) =>
          prev.map((s) =>
            s.id === step.id
              ? { ...s, status: outcome.status, result: outcome.result, value: outcome.value }
              : s
          )
        );
        setProgress(Math.round(((stepIndex + 1) / totalSteps) * 100));
        stepIndex++;
        runNext();
      }, delay);
    };

    const runSummary = () => {
      const summaryDelay = 600 + Math.random() * 800;
      setTimeout(() => {
        setSteps((prev) => {
          const prevSteps = prev.filter((s) => s.id !== "summary");
          const overall = getOverallStatus(prevSteps);
          return [
            ...prevSteps,
            {
              id: "summary",
              label: prev.find((s) => s.id === "summary")?.label || "Summary",
              desc: "Aggregating results",
              status: overall,
              result: overall === "success" ? "All clear" : overall === "warning" ? "Minor issues detected" : "Critical issues found",
              value: overall === "success" ? "Pass" : overall === "warning" ? "Pass w/ Warnings" : "Fail",
            },
          ];
        });
        setProgress(100);
        setPhase("done");
      }, summaryDelay);
    };

    runNext();
  };

  const resetAndClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedSite("");
    setSelectedType("");
    setPriority("medium");
    setNotes("");
    setPhase("config");
    setSteps([]);
    setProgress(0);
    setStartTime(null);
    setElapsed(0);
    onClose();
  };

  if (!open) return null;

  const siteName = sites.find((s) => s.id === selectedSite)?.name || "Unknown";
  const typeLabel = diagnosticTypes.find((t) => t.id === selectedType)?.label || "";
  const overallStatus = phase === "done" ? getOverallStatus(steps) : "pending";

  const elapsedStr = (elapsed / 1000).toFixed(1) + "s";

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={phase === "running" ? undefined : onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-lg mx-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">Run Diagnostic</h2>
          <button
            onClick={phase === "running" ? undefined : resetAndClose}
            disabled={phase === "running"}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors disabled:opacity-40"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {phase === "config" && (
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors cursor-pointer"
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
                    className={`flex flex-col items-start gap-0.5 p-3 rounded-md text-left transition-colors cursor-pointer ${
                      selectedType === dt.id
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className={`${dt.icon} text-xs`}></i>
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">{dt.label}</span>
                    </div>
                    <span className={`text-[10px] leading-tight ${selectedType === dt.id ? "text-background-50/80" : "text-foreground-400"}`}>
                      {dt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      priority === p.id
                        ? "bg-secondary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5" htmlFor="diag-notes">Notes</label>
              <textarea
                id="diag-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-300 transition-colors resize-none"
                placeholder="Optional details or instructions..."
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground-600 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedSite || !selectedType}
                onClick={startDiagnostic}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-stethoscope-line text-sm"></i>
                </div>
                Start Diagnostic
              </button>
            </div>
          </div>
        )}

        {(phase === "running" || phase === "done") && (
          <div className="px-5 py-4 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-foreground-500">
              <span>{siteName} &middot; {typeLabel}</span>
              <span>{phase === "running" ? elapsedStr : `Completed in ${elapsedStr}`}</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-foreground-500">
                <span>{phase === "running" ? "Running diagnostics..." : "Diagnostic complete"}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    phase === "done"
                      ? overallStatus === "success"
                        ? "bg-emerald-500"
                        : overallStatus === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                      : "bg-primary-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="space-y-1.5">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    step.status === "running"
                      ? "bg-primary-100 border border-primary-200"
                      : step.status === "success"
                      ? "bg-emerald-50 border border-emerald-100"
                      : step.status === "warning"
                      ? "bg-amber-50 border border-amber-100"
                      : step.status === "error"
                      ? "bg-red-50 border border-red-100"
                      : "bg-background-100 border border-background-200/50"
                  }`}
                >
                  {/* Status icon */}
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    {step.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-background-300" />
                    )}
                    {step.status === "running" && (
                      <i className="ri-loader-4-line animate-spin text-primary-500 text-lg"></i>
                    )}
                    {step.status === "success" && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <i className="ri-check-line text-background-50 text-xs"></i>
                      </div>
                    )}
                    {step.status === "warning" && (
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <i className="ri-error-warning-line text-background-50 text-xs"></i>
                      </div>
                    )}
                    {step.status === "error" && (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <i className="ri-close-line text-background-50 text-xs"></i>
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.status === "running" ? "text-primary-700" : "text-foreground-800"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-foreground-500 mt-0.5">{step.desc}</p>
                  </div>

                  {/* Result value */}
                  {step.status !== "pending" && step.value && (
                    <div className="shrink-0 text-right">
                      <span className={`text-xs font-semibold ${
                        step.status === "success" ? "text-emerald-600" :
                        step.status === "warning" ? "text-amber-600" :
                        step.status === "error" ? "text-red-600" :
                        "text-foreground-600"
                      }`}>
                        {step.value}
                      </span>
                      {step.result && (
                        <p className={`text-[10px] ${step.status === "success" ? "text-emerald-500" : "text-amber-500"}`}>
                          {step.result}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Overall result banner */}
            {phase === "done" && (
              <div className={`rounded-md px-4 py-3 border ${
                overallStatus === "success"
                  ? "bg-emerald-50 border-emerald-200"
                  : overallStatus === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    overallStatus === "success"
                      ? "bg-emerald-500"
                      : overallStatus === "warning"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}>
                    <i className={`text-background-50 text-lg ${
                      overallStatus === "success" ? "ri-check-line" :
                      overallStatus === "warning" ? "ri-error-warning-line" : "ri-close-line"
                    }`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground-800">
                      {overallStatus === "success" ? "All Systems Nominal" :
                       overallStatus === "warning" ? "Minor Issues Detected" : "Critical Issues Found"}
                    </p>
                    <p className="text-xs text-foreground-500 mt-0.5">
                      {overallStatus === "success"
                        ? "No issues found. Site is operating within normal parameters."
                        : overallStatus === "warning"
                        ? "Some checks returned degraded results. Review the flagged items above."
                        : "One or more checks failed. Immediate attention recommended."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              {phase === "done" && (
                <button
                  type="button"
                  onClick={() => {
                    setPhase("config");
                    setSteps([]);
                    setProgress(0);
                    setStartTime(null);
                    setElapsed(0);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground-600 hover:bg-background-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-refresh-line text-sm"></i>
                  </div>
                  Run Again
                </button>
              )}
              <button
                type="button"
                onClick={resetAndClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer ml-auto"
              >
                {phase === "done" ? "Close" : "Cancel Diagnostic"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function genValue(stepId: string): string {
  const values: Record<string, string> = {
    cpu: (60 + Math.random() * 35).toFixed(1) + "% usage",
    memory: (Math.random() * 32).toFixed(2) + " GB/s",
    disk: (80 + Math.random() * 400).toFixed(0) + " MB/s",
    throughput: (Math.floor(Math.random() * 8000 + 4000)) + " req/s",
    latency: (Math.floor(Math.random() * 45 + 3)) + "ms",
    "packet-loss": "0.00%",
    bandwidth: (Math.floor(Math.random() * 200 + 300)) + " Mbps",
    dns: (Math.floor(Math.random() * 30 + 2)) + "ms",
    sensors: (Math.random() * 1.5).toFixed(2) + "% drift",
    controllers: "Online",
    actuators: (Math.floor(Math.random() * 80 + 120)) + "ms",
    alarms: "Operational",
    access: (Math.floor(Math.random() * 5 + 95)) + "% compliant",
    vuln: "0 critical, " + Math.floor(Math.random() * 4) + " low",
    firewall: "All rules valid",
    "audit-log": "No anomalies",
  };
  return values[stepId] || "Normal";
}

function genWarnValue(stepId: string): string {
  const values: Record<string, string> = {
    cpu: (85 + Math.random() * 12).toFixed(1) + "% usage",
    memory: (Math.random() * 8 + 20).toFixed(2) + " GB/s",
    disk: (40 + Math.random() * 40).toFixed(0) + " MB/s",
    throughput: (Math.floor(Math.random() * 2000 + 2000)) + " req/s",
    latency: (Math.floor(Math.random() * 60 + 40)) + "ms",
    "packet-loss": (Math.random() * 0.8 + 0.1).toFixed(2) + "%",
    bandwidth: (Math.floor(Math.random() * 80 + 40)) + " Mbps",
    dns: (Math.floor(Math.random() * 100 + 40)) + "ms",
    sensors: (Math.random() * 3 + 1.5).toFixed(2) + "% drift",
    controllers: "Degraded",
    actuators: (Math.floor(Math.random() * 200 + 180)) + "ms",
    alarms: "Partial",
    access: (Math.floor(Math.random() * 15 + 80)) + "% compliant",
    vuln: "1 medium, " + Math.floor(Math.random() * 5 + 2) + " low",
    firewall: "2 rules outdated",
    "audit-log": (Math.floor(Math.random() * 3 + 1)) + " anomalies",
  };
  return values[stepId] || "Degraded";
}