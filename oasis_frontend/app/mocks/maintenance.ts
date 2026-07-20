export type WorkOrderStatus = "open" | "in_progress" | "review" | "closed";

export type WorkOrderPriority = "critical" | "high" | "medium" | "low";

export interface WorkOrder {
  id: string;
  woNumber: string;
  title: string;
  description: string;
  asset: string;
  assetId: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  createdDate: string;
  estimatedHours: number;
  actualHours: number;
  category: string;
  tags: string[];
}

export type CalendarEventType = "pm" | "wo" | "inspection" | "downtime" | "training";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: CalendarEventType;
  asset?: string;
  assignee?: string;
  description?: string;
  allDay?: boolean;
}

export const workOrderColumns: { id: WorkOrderStatus; label: string; color: string }[] = [
  { id: "open", label: "Open", color: "bg-secondary-500" },
  { id: "in_progress", label: "In Progress", color: "bg-primary-500" },
  { id: "review", label: "Review", color: "bg-accent-500" },
  { id: "closed", label: "Closed", color: "bg-foreground-300" },
];

// Raw: [Maintenance_ID, Asset_ID, Maintenance_Date, Maintenance_Type, Technician_Name, Issue_Found, Action_Taken, Cost, Downtime_Hours]
const rawMaintenance: [string, string, string, string, string, string, string, number, number][] = [
  ["MR-00001", "AST-0069", "2026-07-15", "Repair", "Emily Chen", "Seal failure detected", "Repaired actuator wiring and tested function", 1829.93, 5.9],
  ["MR-00002", "AST-0069", "2026-07-10", "Repair", "Chloe Bennett", "Overheating due to blocked coolant line", "Repaired actuator wiring and tested function", 6716.18, 18.3],
  ["MR-00003", "AST-0021", "2026-07-12", "Repair", "Grace Kim", "Valve actuator malfunction", "Replaced pressure relief valve", 3341.2, 12.5],
  ["MR-00004", "AST-0097", "2026-07-08", "Inspection", "Grace Kim", "Minor surface corrosion noted", "Flagged for follow-up inspection next cycle", 768.15, 0.6],
  ["MR-00005", "AST-0060", "2026-07-18", "Repair", "Sarah Coyne", "Bearing wear causing excess vibration", "Replaced faulty seal and pressure-tested unit", 4460.32, 21.8],
  ["MR-00006", "AST-0069", "2026-07-20", "Repair", "Omar Haddad", "Valve actuator malfunction", "Cleared blockage and flushed cooling system", 4568.91, 10.6],
  ["MR-00007", "AST-0030", "2026-07-14", "Preventative Maintenance", "Brandon Lee", "Minor corrosion on housing", "Cleaned and recalibrated sensors", 546.98, 0.5],
  ["MR-00008", "AST-0120", "2026-07-22", "Preventative Maintenance", "Jose Martinez", "Lubricant levels low", "Performed scheduled lubrication and inspection", 1355.26, 0.9],
  ["MR-00009", "AST-0007", "2026-07-25", "Repair", "Jose Martinez", "Valve actuator malfunction", "Replaced faulty seal and pressure-tested unit", 6630.8, 9.4],
  ["MR-00010", "AST-0021", "2026-07-28", "Repair", "Grace Kim", "Seal failure detected", "Replaced worn bearing assembly", 4346.06, 10.4],
  ["MR-00011", "AST-0028", "2026-07-11", "Preventative Maintenance", "Jose Martinez", "No significant issues found", "Cleaned and recalibrated sensors", 1012.31, 0.6],
  ["MR-00012", "AST-0118", "2026-07-16", "Repair", "Nate Wilkerson", "Bearing wear causing excess vibration", "Replaced pressure relief valve", 5743.13, 20.0],
  ["MR-00013", "AST-0143", "2026-07-09", "Preventative Maintenance", "Chloe Bennett", "No significant issues found", "Tightened fittings and inspected seals", 1440.69, 2.2],
  ["MR-00014", "AST-0082", "2026-07-05", "Equipment Replacement", "Alicia Ferguson", "Irreparable mechanical failure", "Installed replacement component and verified operation", 34708.32, 56.6],
  ["MR-00015", "AST-0003", "2026-07-13", "Inspection", "Brandon Lee", "Sensor calibration drift detected", "Recalibrated sensor to manufacturer spec", 676.6, 0.9],
  ["MR-00016", "AST-0143", "2026-08-19", "Repair", "Jose Martinez", "Pressure relief valve stuck", "Repaired actuator wiring and tested function", 2948.59, 9.0],
  ["MR-00017", "AST-0069", "2026-08-21", "Repair", "Brandon Lee", "Pressure relief valve stuck", "Repaired actuator wiring and tested function", 1377.98, 6.7],
  ["MR-00018", "AST-0094", "2026-08-07", "Preventative Maintenance", "Jose Martinez", "Minor corrosion on housing", "Performed scheduled lubrication and inspection", 570.08, 0.6],
  ["MR-00019", "AST-0080", "2026-08-17", "Inspection", "Emily Chen", "Slight pressure fluctuation observed", "Flagged for follow-up inspection next cycle", 374.37, 0.7],
  ["MR-00020", "AST-0082", "2026-08-23", "Repair", "Nate Wilkerson", "Pressure relief valve stuck", "Replaced pressure relief valve", 5079.44, 19.0],
  ["MR-00021", "AST-0108", "2026-08-24", "Repair", "Mike Delgado", "Valve actuator malfunction", "Repaired actuator wiring and tested function", 1313.99, 16.6],
  ["MR-00022", "AST-0108", "2026-08-26", "Preventative Maintenance", "Brandon Lee", "No significant issues found", "Performed scheduled lubrication and inspection", 1348.73, 0.8],
  ["MR-00023", "AST-0084", "2026-08-27", "Preventative Maintenance", "Omar Haddad", "No significant issues found", "Cleaned and recalibrated sensors", 1223.58, 1.3],
  ["MR-00024", "AST-0094", "2026-08-29", "Preventative Maintenance", "Jose Martinez", "No significant issues found", "Replaced filters and topped off fluids", 1127.6, 3.8],
  ["MR-00025", "AST-0113", "2026-08-30", "Preventative Maintenance", "Jose Martinez", "Minor corrosion on housing", "Replaced filters and topped off fluids", 1100.19, 2.6],
  ["MR-00026", "AST-0002", "2026-08-04", "Repair", "Emily Chen", "Valve actuator malfunction", "Replaced worn bearing assembly", 4370.69, 21.0],
  ["MR-00027", "AST-0037", "2026-08-03", "Preventative Maintenance", "Jose Martinez", "Lubricant levels low", "Cleaned and recalibrated sensors", 1237.23, 3.5],
  ["MR-00028", "AST-0114", "2026-08-06", "Preventative Maintenance", "Jose Martinez", "Routine wear observed within tolerance", "Replaced filters and topped off fluids", 921.96, 2.6],
  ["MR-00029", "AST-0143", "2026-09-10", "Preventative Maintenance", "Emily Chen", "Minor corrosion on housing", "Cleaned and recalibrated sensors", 1120.48, 4.0],
  ["MR-00030", "AST-0108", "2026-09-12", "Inspection", "Sarah Coyne", "Sensor calibration drift detected", "Flagged for follow-up inspection next cycle", 768.13, 0.1],
  ["MR-00031", "AST-0124", "2026-09-15", "Inspection", "Brandon Lee", "No issues found, within spec", "Recalibrated sensor to manufacturer spec", 571.79, 1.5],
  ["MR-00032", "AST-0131", "2026-09-18", "Preventative Maintenance", "Grace Kim", "Filter buildup detected", "Tightened fittings and inspected seals", 626.74, 2.5],
  ["MR-00033", "AST-0033", "2026-09-20", "Preventative Maintenance", "Sarah Coyne", "Filter buildup detected", "Tightened fittings and inspected seals", 553.21, 2.9],
  ["MR-00034", "AST-0108", "2026-09-22", "Preventative Maintenance", "Brandon Lee", "Minor corrosion on housing", "Performed scheduled lubrication and inspection", 374.96, 1.2],
  ["MR-00035", "AST-0108", "2026-09-25", "Inspection", "Brandon Lee", "Minor surface corrosion noted", "Completed visual and instrument inspection, logged readings", 621.52, 1.0],
  ["MR-00036", "AST-0069", "2026-09-02", "Inspection", "Omar Haddad", "Sensor calibration drift detected", "Documented findings, no action required", 648.58, 0.3],
  ["MR-00037", "AST-0039", "2026-09-01", "Inspection", "Grace Kim", "No issues found, within spec", "Documented findings, no action required", 374.38, 0.5],
  ["MR-00038", "AST-0002", "2026-09-28", "Preventative Maintenance", "Emily Chen", "Routine wear observed within tolerance", "Performed scheduled lubrication and inspection", 1210.73, 3.9],
  ["MR-00039", "AST-0094", "2026-09-30", "Inspection", "Emily Chen", "Wiring insulation showing early wear", "Documented findings, no action required", 221.61, 0.5],
  ["MR-00040", "AST-0084", "2026-09-01", "Inspection", "Emily Chen", "No issues found, within spec", "Flagged for follow-up inspection next cycle", 503.61, 0.3],
];

function getStatus(type: string, idx: number): WorkOrderStatus {
  const hash = (idx * 7 + type.length) % 10;
  switch (type) {
    case "Repair":
      if (hash < 4) return "open";
      if (hash < 7) return "in_progress";
      if (hash < 9) return "review";
      return "closed";
    case "Preventative Maintenance":
      if (hash < 6) return "closed";
      if (hash < 9) return "in_progress";
      return "review";
    case "Inspection":
      if (hash < 5) return "review";
      if (hash < 9) return "closed";
      return "open";
    case "Equipment Replacement":
      if (hash < 5) return "in_progress";
      if (hash < 8) return "open";
      return "review";
    default:
      return "open";
  }
}

function getPriority(type: string, idx: number, cost: number): WorkOrderPriority {
  const hash = (idx * 11 + Math.floor(cost / 1000)) % 10;
  switch (type) {
    case "Repair":
      if (hash < 6) return "high";
      if (hash < 8) return "critical";
      return "medium";
    case "Preventative Maintenance":
      if (hash < 7) return "medium";
      return "high";
    case "Inspection":
      if (hash < 6) return "medium";
      if (hash < 9) return "high";
      return "low";
    case "Equipment Replacement":
      if (hash < 5) return "critical";
      if (hash < 9) return "high";
      return "medium";
    default:
      return "medium";
  }
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("");
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export const workOrders: WorkOrder[] = rawMaintenance.map((raw, idx) => {
  const [id, assetId, date, type, tech, issue, action, cost, downtime] = raw;
  return {
    id: id.toLowerCase(),
    woNumber: id,
    title: issue,
    description: action,
    asset: assetId,
    assetId,
    status: getStatus(type, idx),
    priority: getPriority(type, idx, cost),
    assignee: tech,
    assigneeInitials: getInitials(tech),
    dueDate: addDays(date, 7),
    createdDate: date,
    estimatedHours: Math.ceil(downtime),
    actualHours: Math.max(0.5, downtime * 0.8),
    category: type,
    tags: [type, issue.split(" ").slice(0, 2).join(" ")],
  };
});

export const calendarEvents: CalendarEvent[] = workOrders.map((wo) => ({
  id: `evt-${wo.id}`,
  title: `${wo.category}: ${wo.asset}`,
  date: wo.createdDate,
  type: wo.category === "Preventative Maintenance" ? "pm" : wo.category === "Inspection" ? "inspection" : "wo",
  asset: wo.asset,
  assignee: wo.assignee,
  allDay: true,
}));

export const totalMaintenanceCost = rawMaintenance.reduce((sum, r) => sum + r[7], 0);
export const totalDowntimeHours = rawMaintenance.reduce((sum, r) => sum + r[8], 0);
export const overdueWorkOrders = workOrders.filter((wo) => wo.status === "open" && new Date(wo.dueDate) < new Date("2026-07-15")).length;
export const openWorkOrders = workOrders.filter((wo) => wo.status === "open").length;
export const inProgressWorkOrders = workOrders.filter((wo) => wo.status === "in_progress").length;
export const pmComplianceRate = Math.round(
  (workOrders.filter((wo) => wo.category === "Preventative Maintenance" && wo.status === "closed").length /
    Math.max(1, workOrders.filter((wo) => wo.category === "Prevent preventative Maintenance").length)) * 100
);