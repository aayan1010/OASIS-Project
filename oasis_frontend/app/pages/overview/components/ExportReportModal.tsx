import { useState, type FormEvent } from "react";
import { productionRecords, downtimeEvents } from "../../../mocks/production";
import { workOrders } from "../../../mocks/maintenance";
import { alertRecords } from "../../../mocks/alerts";
import { assetLocations } from "../../../mocks/assets";
import { monthlyBudget, opexBreakdown, revenueStreams, capexProjects } from "../../../mocks/finance";

interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
}

const reportTypes = [
  { id: "production", label: "Production Summary" },
  { id: "maintenance", label: "Maintenance Report" },
  { id: "safety", label: "Safety & Incidents" },
  { id: "financial", label: "Financial Overview" },
  { id: "assets", label: "Asset Health" },
  { id: "downtime", label: "Downtime Analysis" },
];

const formats = [
  { id: "csv", label: "CSV", icon: "ri-file-excel-2-line" },
  { id: "pdf", label: "PDF", icon: "ri-file-pdf-2-line" },
];

const dateRanges = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "all", label: "All data" },
];

function escapeCsvValue(val: unknown): string {
  const str = val == null ? "" : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(headers: string[], rows: unknown[][]): string {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvValue).join(","));
  return [headerLine, ...dataLines].join("\n");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function openPdfInNewTab(htmlContent: string) {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  URL.revokeObjectURL(url);
}

function generateReportData(reportType: string) {
  const now = new Date().toISOString().slice(0, 10);

  switch (reportType) {
    case "production": {
      const headers = ["Record ID", "Site ID", "Date", "Target (bbl)", "Actual (bbl)", "Efficiency (%)", "Downtime (hrs)", "Energy Used (kWh)"];
      const rows = productionRecords.map((r) => [r.id, r.siteId, r.date, r.target, r.actual, r.efficiency, r.downtimeHours, r.energyUsed]);
      return { headers, rows, title: "Production Summary Report" };
    }
    case "maintenance": {
      const headers = ["WO Number", "Asset ID", "Type", "Status", "Priority", "Assignee", "Created Date", "Due Date", "Est. Hours", "Issue", "Action"];
      const rows = workOrders.map((wo) => [wo.woNumber, wo.assetId, wo.category, wo.status, wo.priority, wo.assignee, wo.createdDate, wo.dueDate, wo.estimatedHours, wo.title, wo.description]);
      return { headers, rows, title: "Maintenance Report" };
    }
    case "safety": {
      const headers = ["Alert ID", "Asset ID", "Timestamp", "Type", "Severity", "Description", "Status", "Resolution Time"];
      const rows = alertRecords.map((a) => [a.id, a.assetId, a.timestamp, a.alertType, a.severity, a.description, a.status, a.resolutionTime ?? ""]);
      return { headers, rows, title: "Safety & Incidents Report" };
    }
    case "financial": {
      const headers = ["Month", "Budget", "Actual", "Variance"];
      const rows = monthlyBudget.map((m) => [m.month, m.budget, m.actual, m.actual - m.budget]);
      return { headers, rows, title: "Financial Overview Report" };
    }
    case "assets": {
      const headers = ["Asset ID", "Name", "Site ID", "Type", "Status", "Health Score", "Criticality", "Installed", "Op. Hours", "RUL (days)", "Last Maintenance", "Next Maintenance"];
      const rows = assetLocations.map((a) => [a.id, a.name, a.siteId ?? "", a.type, a.status, a.healthScore ?? "", a.criticality, a.installationDate ?? "", a.operationalHours ?? "", a.remainingLifeDays ?? "", a.lastMaintenance ?? "", a.nextMaintenance ?? ""]);
      return { headers, rows, title: "Asset Health Report" };
    }
    case "downtime": {
      const headers = ["Event ID", "Asset/Site", "Start Time", "Duration", "Reason", "Impact", "Status"];
      const rows = downtimeEvents.map((e) => [e.id, e.asset, e.startTime, e.duration, e.reason, e.impact, e.status]);
      return { headers, rows, title: "Downtime Analysis Report" };
    }
    default:
      return { headers: ["ID", "Value"], rows: [["", ""]], title: "Report" };
  }
}

function generatePdfHtml(reportType: string, title: string, headers: string[], rows: unknown[][]) {
  const now = new Date().toLocaleString();
  const tableHeaders = headers.map((h) => `<th>${h}</th>`).join("");
  const tableRows = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell == null ? "" : String(cell)}</td>`).join("")}</tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f5f5f5; text-align: left; padding: 8px 10px; border-bottom: 2px solid #ddd; font-weight: 600; white-space: nowrap; }
    td { padding: 6px 10px; border-bottom: 1px solid #eee; }
    tr:hover td { background: #fafafa; }
    .footer { margin-top: 30px; font-size: 11px; color: #999; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Generated: ${now} &middot; ${rows.length} records</p>
  <table>
    <thead><tr>${tableHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <p class="footer">OPS Command Center &mdash; Confidential</p>
  <script>window.onload = function() { window.print(); };<` + `/script>
</body>
</html>`;
}

export default function ExportReportModal({ open, onClose }: ExportReportModalProps) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [selectedRange, setSelectedRange] = useState("7d");
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleExport = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setExporting(true);

    setTimeout(() => {
      try {
        const { headers, rows, title } = generateReportData(selectedType);
        const fmt = formats.find((f) => f.id === selectedFormat)?.label ?? "CSV";
        const filename = `${selectedType}-report-${new Date().toISOString().slice(0, 10)}`;

        if (selectedFormat === "csv") {
          const csv = buildCsv(headers, rows);
          downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
        } else {
          const html = generatePdfHtml(selectedType, title, headers, rows);
          openPdfInNewTab(html);
        }

        setExporting(false);
        setDone(true);

        setTimeout(() => {
          setDone(false);
          setSelectedType("");
          onClose();
        }, 1800);
      } catch {
        setExporting(false);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-lg border border-background-200/70 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <h2 className="text-base font-heading font-semibold text-foreground-900">
            Export Report
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
            <p className="text-sm font-medium text-foreground-800">Report Exported</p>
            <p className="text-xs text-foreground-500 mt-1">
              {reportTypes.find((t) => t.id === selectedType)?.label} ({formats.find((f) => f.id === selectedFormat)?.label}) downloaded to your computer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleExport} className="px-5 py-4 space-y-4">
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
                <option value="">Select report...</option>
                {reportTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>{rt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Date Range
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

            <div>
              <label className="block text-xs font-medium text-foreground-600 mb-1.5">
                Format
              </label>
              <div className="flex gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedFormat === fmt.id
                        ? "bg-secondary-500 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${fmt.icon} text-sm`}></i>
                    </div>
                    {fmt.label}
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
                disabled={exporting || !selectedType}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-download-line text-sm"></i>
                    </div>
                    Export
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