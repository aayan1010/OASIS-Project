export interface AlertRecord {
  id: string;
  assetId: string;
  timestamp: string;
  alertType: string;
  severity: "high" | "medium" | "low";
  description: string;
  status: "active" | "acknowledged" | "resolved";
  resolutionTime?: string;
}

export interface RecentAlert {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  module: string;
  time: string;
  status: "active" | "acknowledged" | "resolved";
}

const rawAlerts: [string, string, string, string, string, string, string, string?][] = [
  ["ALT-00001", "AST-0092", "2026-06-29 01:00:00", "High Temperature", "High", "Sustained high temperature detected during operation", "Acknowledged", ""],
  ["ALT-00002", "AST-0058", "2026-06-29 01:00:00", "High Temperature", "Critical", "Temperature reading exceeded safe operating threshold", "Resolved", "2026-06-30 21:25:33"],
  ["ALT-00003", "AST-0093", "2026-06-29 01:00:00", "High Temperature", "High", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-06-29 18:11:26"],
  ["ALT-00004", "AST-0057", "2026-06-29 01:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-06-30 23:35:50"],
  ["ALT-00005", "AST-0054", "2026-06-29 01:00:00", "High Temperature", "High", "Temperature reading exceeded safe operating threshold", "Resolved", "2026-06-30 03:26:56"],
  ["ALT-00006", "AST-0117", "2026-06-29 01:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-06-30 11:24:24"],
  ["ALT-00007", "AST-0032", "2026-06-29 01:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-06-29 22:36:31"],
  ["ALT-00008", "AST-0063", "2026-06-29 01:00:00", "High Temperature", "High", "Sustained high temperature detected during operation", "Resolved", "2026-06-30 09:05:42"],
  ["ALT-00009", "AST-0069", "2026-06-29 01:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-06-30 18:51:52"],
  ["ALT-00010", "AST-0028", "2026-06-29 01:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Resolved", "2026-07-01 04:58:02"],
  ["ALT-00015", "AST-0012", "2026-06-29 01:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Acknowledged", ""],
  ["ALT-00019", "AST-0030", "2026-06-29 05:00:00", "Excess Vibration", "High", "Sustained high-frequency vibration detected", "Resolved", "2026-06-29 10:31:18"],
  ["ALT-00030", "AST-0120", "2026-06-29 15:00:00", "High Temperature", "Medium", "Temperature reading exceeded safe operating threshold", "Open", ""],
  ["ALT-00035", "AST-0142", "2026-06-29 17:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Open", ""],
  ["ALT-00036", "AST-0096", "2026-06-29 17:00:00", "High Temperature", "High", "Temperature reading exceeded safe operating threshold", "Acknowledged", ""],
  ["ALT-00044", "AST-0099", "2026-06-30 03:00:00", "Excess Vibration", "High", "Sustained high-frequency vibration detected", "Resolved", "2026-06-30 20:32:04"],
  ["ALT-00048", "AST-0060", "2026-06-30 11:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Open", ""],
  ["ALT-00055", "AST-0142", "2026-06-30 15:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Acknowledged", ""],
  ["ALT-00064", "AST-0120", "2026-06-30 19:00:00", "High Temperature", "High", "Sustained high temperature detected during operation", "Open", ""],
  ["ALT-00065", "AST-0096", "2026-06-30 21:00:00", "High Temperature", "High", "Temperature reading exceeded safe operating threshold", "Acknowledged", ""],
  ["ALT-00076", "AST-0054", "2026-07-01 11:00:00", "Excess Vibration", "Critical", "Abnormal vibration pattern detected, possible bearing wear", "Resolved", "2026-07-03 21:34:43"],
  ["ALT-00077", "AST-0142", "2026-07-01 12:00:00", "High Temperature", "High", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-07-01 15:20:46"],
  ["ALT-00078", "AST-0032", "2026-07-01 12:00:00", "High Temperature", "High", "Sustained high temperature detected during operation", "Acknowledged", ""],
  ["ALT-00084", "AST-0061", "2026-07-01 15:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Open", ""],
  ["ALT-00090", "AST-0116", "2026-07-01 18:00:00", "High Temperature", "High", "Sustained high temperature detected during operation", "Acknowledged", ""],
  ["ALT-00102", "AST-0090", "2026-07-02 12:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Open", ""],
  ["ALT-00107", "AST-0107", "2026-07-02 15:00:00", "Excess Vibration", "Medium", "Sustained high-frequency vibration detected", "Resolved", "2026-07-03 04:29:20"],
  ["ALT-00109", "AST-0096", "2026-07-02 16:00:00", "High Temperature", "High", "Temperature reading exceeded safe operating threshold", "Acknowledged", ""],
  ["ALT-00121", "AST-0107", "2026-07-03 00:00:00", "Excess Vibration", "Medium", "Abnormal vibration pattern detected, possible bearing wear", "Open", ""],
  ["ALT-00123", "AST-0028", "2026-07-03 06:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Open", ""],
  ["ALT-00124", "AST-0090", "2026-07-03 06:00:00", "High Temperature", "Medium", "Temperature reading exceeded safe operating threshold", "Open", ""],
  ["ALT-00138", "AST-0023", "2026-07-03 15:00:00", "High Temperature", "High", "Temperature reading exceeded safe operating threshold", "Open", ""],
  ["ALT-00139", "AST-0028", "2026-07-03 15:00:00", "Excess Vibration", "High", "Vibration levels exceeded normal operating threshold", "Open", ""],
  ["ALT-00140", "AST-0142", "2026-07-03 16:00:00", "High Temperature", "Medium", "Sustained high temperature detected during operation", "Resolved", "2026-07-05 16:39:49"],
  ["ALT-00141", "AST-0061", "2026-07-03 16:00:00", "High Temperature", "Medium", "Thermal sensor flagged abnormal heat buildup", "Resolved", "2026-07-06 01:21:53"],
  ["ALT-00142", "AST-0116", "2026-07-03 16:00:00", "High Temperature", "Medium", "Temperature reading exceeded safe operating threshold", "Resolved", "2026-07-05 23:51:00"],
  ["ALT-00143", "AST-0132", "2026-07-03 16:00:00", "Excess Vibration", "High", "Sustained high-frequency vibration detected", "Resolved", "2026-07-06 08:13:32"],
];

function mapSeverity(sev: string): "high" | "medium" | "low" {
  if (sev === "Critical" || sev === "High") return "high";
  if (sev === "Medium") return "medium";
  return "low";
}

function mapStatus(st: string): "active" | "acknowledged" | "resolved" {
  if (st === "Open") return "active";
  if (st === "Acknowledged") return "acknowledged";
  return "resolved";
}

function formatTime(ts: string): string {
  const date = new Date(ts);
  const now = new Date("2026-07-15T00:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHrs > 0) return `${diffHrs}h ago`;
  return "Just now";
}

export const alertRecords: AlertRecord[] = rawAlerts.map((raw) => {
  const [id, assetId, timestamp, alertType, severity, description, status, resolutionTime] = raw;
  return {
    id,
    assetId,
    timestamp,
    alertType,
    severity: mapSeverity(severity),
    description,
    status: mapStatus(status),
    resolutionTime: resolutionTime || undefined,
  };
});

export const recentAlerts: RecentAlert[] = alertRecords.map((a) => ({
  id: a.id,
  title: `${a.alertType} — ${a.assetId}`,
  severity: a.severity,
  module: "Assets",
  time: formatTime(a.timestamp),
  status: a.status,
}));

export const activeAlertCount = alertRecords.filter((a) => a.status === "active").length;
export const highSeverityAlertCount = alertRecords.filter((a) => a.status === "active" && a.severity === "high").length;
export const acknowledgedAlertCount = alertRecords.filter((a) => a.status === "acknowledged").length;
export const resolvedAlertCount = alertRecords.filter((a) => a.status === "resolved").length;

export const alertTypeBreakdown = [
  { type: "High Temperature", count: alertRecords.filter((a) => a.alertType === "High Temperature").length },
  { type: "Excess Vibration", count: alertRecords.filter((a) => a.alertType === "Excess Vibration").length },
];