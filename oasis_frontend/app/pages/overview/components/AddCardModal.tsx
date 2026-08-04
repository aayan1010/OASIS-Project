import { useState, useMemo } from "react";
import type { AlertThreshold } from "../../../components/feature/ThresholdSettings";
import { sites, type Site } from "../../../mocks/sites";
import { alertRecords } from "../../../mocks/alerts";
import { assetLocations, type AssetLocation } from "../../../mocks/assets";
import { workOrders, totalMaintenanceCost } from "../../../mocks/maintenance";
import { productionRecords, totalDailyProduction, avgEfficiency, totalDowntime, totalEnergyUsed } from "../../../mocks/production";

// ---- Types ----

export interface KpiItem {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  color?: "primary" | "accent" | "secondary";
  pinned?: boolean;
  thresholds?: AlertThreshold;
}

type DataSource = "sites" | "alerts" | "assets" | "maintenance" | "production";
type Calculation = "count" | "sum" | "avg" | "min" | "max";

interface CustomCardConfig {
  dataSource: DataSource;
  itemIds: string[];
  field: string;
  calculation: Calculation;
}

const CALC_LABELS: Record<Calculation, string> = {
  count: "Count",
  sum: "Sum",
  avg: "Average",
  min: "Minimum",
  max: "Maximum",
};

const SOURCE_LABELS: Record<DataSource, string> = {
  sites: "Sites",
  alerts: "Alerts",
  assets: "Assets",
  maintenance: "Maintenance",
  production: "Production",
};

const SOURCE_ICONS: Record<DataSource, string> = {
  sites: "ri-building-line",
  alerts: "ri-alarm-warning-line",
  assets: "ri-cpu-line",
  maintenance: "ri-tools-line",
  production: "ri-drop-line",
};

interface FieldMeta {
  key: string;
  label: string;
  type: "number" | "string";
}

const SOURCE_FIELDS: Record<DataSource, FieldMeta[]> = {
  sites: [{ key: "assetCount", label: "Asset Count", type: "number" }],
  alerts: [],
  assets: [{ key: "healthScore", label: "Health Score", type: "number" }],
  maintenance: [
    { key: "cost", label: "Cost ($)", type: "number" },
    { key: "downtimeHours", label: "Downtime (hrs)", type: "number" },
    { key: "estimatedHours", label: "Est. Hours", type: "number" },
    { key: "actualHours", label: "Actual Hours", type: "number" },
  ],
  production: [
    { key: "actual", label: "Actual Output", type: "number" },
    { key: "target", label: "Target", type: "number" },
    { key: "efficiency", label: "Efficiency (%)", type: "number" },
    { key: "downtimeHours", label: "Downtime (hrs)", type: "number" },
    { key: "energyUsed", label: "Energy Used (kWh)", type: "number" },
  ],
};

interface SourceItem {
  id: string;
  label: string;
}

// ---- Helpers ----

function getSourceItems(ds: DataSource): SourceItem[] {
  switch (ds) {
    case "sites":
      return sites.map((s) => ({ id: s.id, label: s.name }));
    case "alerts":
      return alertRecords.map((a) => ({ id: a.id, label: `${a.alertType} — ${a.assetId}` }));
    case "assets":
      return assetLocations.map((a) => ({ id: a.id, label: a.name }));
    case "maintenance":
      return workOrders.map((w) => ({ id: w.id, label: `${w.asset} — ${w.title}` }));
    case "production":
      return productionRecords.map((p) => ({ id: p.id, label: `${p.siteId} — ${p.date}` }));
    default:
      return [];
  }
}

function getNumericValue(item: unknown, field: string): number {
  return Number((item as Record<string, unknown>)[field]) || 0;
}

function computeValue(config: CustomCardConfig): string | number {
  const { dataSource, field, calculation, itemIds } = config;

  let data: unknown[] = [];
  switch (dataSource) {
    case "sites":
      data = itemIds.length > 0 ? sites.filter((s) => itemIds.includes(s.id)) : sites;
      break;
    case "alerts":
      data = itemIds.length > 0 ? alertRecords.filter((a) => itemIds.includes(a.id)) : alertRecords;
      break;
    case "assets":
      data = itemIds.length > 0 ? assetLocations.filter((a) => itemIds.includes(a.id)) : assetLocations;
      break;
    case "maintenance":
      data = itemIds.length > 0 ? workOrders.filter((w) => itemIds.includes(w.id)) : workOrders;
      break;
    case "production":
      data = itemIds.length > 0 ? productionRecords.filter((p) => itemIds.includes(p.id)) : productionRecords;
      break;
  }

  if (calculation === "count") {
    return data.length;
  }

  const nums = data.map((d) => getNumericValue(d, field)).filter((n) => !isNaN(n));
  if (nums.length === 0) return 0;

  switch (calculation) {
    case "sum":
      return Math.round(nums.reduce((a, b) => a + b, 0) * 100) / 100;
    case "avg":
      return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
    case "min":
      return Math.round(Math.min(...nums) * 100) / 100;
    case "max":
      return Math.round(Math.max(...nums) * 100) / 100;
    default:
      return 0;
  }
}

// ---- Premade Templates ----

interface PremadeTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: "primary" | "accent" | "secondary";
  compute: () => { value: string | number; unit?: string };
}

const PREMADE_TEMPLATES: PremadeTemplate[] = [
  // Sites
  {
    id: "premade-total-sites",
    title: "Total Sites",
    subtitle: "All registered sites",
    icon: "ri-building-line",
    color: "primary",
    compute: () => ({ value: sites.length }),
  },
  {
    id: "premade-active-sites",
    title: "Active Sites",
    subtitle: "Sites currently operational",
    icon: "ri-check-double-line",
    color: "primary",
    compute: () => ({ value: sites.filter((s) => s.status === "Active").length }),
  },
  {
    id: "premade-total-assets-across",
    title: "Total Assets (All Sites)",
    subtitle: "Sum of assets across all sites",
    icon: "ri-stack-line",
    color: "primary",
    compute: () => ({ value: sites.reduce((sum, s) => sum + s.assetCount, 0) }),
  },
  {
    id: "premade-avg-assets-per-site",
    title: "Avg Assets / Site",
    subtitle: "Average asset count per site",
    icon: "ri-donut-chart-line",
    color: "primary",
    compute: () => ({ value: Math.round(sites.reduce((sum, s) => sum + s.assetCount, 0) / sites.length) }),
  },
  // Alerts
  {
    id: "premade-total-alerts",
    title: "Total Alerts",
    subtitle: "All alert records",
    icon: "ri-notification-3-line",
    color: "accent",
    compute: () => ({ value: alertRecords.length }),
  },
  {
    id: "premade-active-alerts",
    title: "Active Alerts",
    subtitle: "Currently open alerts",
    icon: "ri-alarm-warning-line",
    color: "accent",
    compute: () => ({ value: alertRecords.filter((a) => a.status === "active").length }),
  },
  {
    id: "premade-critical-alerts",
    title: "Critical Alerts",
    subtitle: "High severity active alerts",
    icon: "ri-error-warning-line",
    color: "accent",
    compute: () => ({ value: alertRecords.filter((a) => a.severity === "high" && a.status === "active").length }),
  },
  {
    id: "premade-resolved-alerts",
    title: "Resolved Alerts",
    subtitle: "Successfully resolved",
    icon: "ri-checkbox-circle-line",
    color: "accent",
    compute: () => ({ value: alertRecords.filter((a) => a.status === "resolved").length }),
  },
  // Assets
  {
    id: "premade-total-assets",
    title: "Total Assets",
    subtitle: "All tracked equipment",
    icon: "ri-cpu-line",
    color: "secondary",
    compute: () => ({ value: assetLocations.length }),
  },
  {
    id: "premade-online-assets",
    title: "Online Assets",
    subtitle: "Currently operational",
    icon: "ri-wifi-line",
    color: "secondary",
    compute: () => ({ value: assetLocations.filter((a) => a.status === "online").length }),
  },
  {
    id: "premade-offline-assets",
    title: "Offline / Degraded",
    subtitle: "Assets requiring attention",
    icon: "ri-close-circle-line",
    color: "secondary",
    compute: () => ({ value: assetLocations.filter((a) => a.status === "offline" || a.status === "degraded").length }),
  },
  {
    id: "premade-avg-health",
    title: "Average Asset Health",
    subtitle: "Mean health score across all assets",
    icon: "ri-heart-pulse-line",
    color: "secondary",
    compute: () => ({
      value: `${Math.round(assetLocations.reduce((s, a) => s + (a.healthScore ?? 0), 0) / assetLocations.length * 10) / 10}%`,
    }),
  },
  // Maintenance
  {
    id: "premade-open-wo",
    title: "Open Work Orders",
    subtitle: "Pending maintenance tasks",
    icon: "ri-clipboard-line",
    color: "primary",
    compute: () => ({ value: workOrders.filter((w) => w.status === "open").length }),
  },
  {
    id: "premade-in-progress-wo",
    title: "WOs In Progress",
    subtitle: "Currently being worked on",
    icon: "ri-loader-4-line",
    color: "primary",
    compute: () => ({ value: workOrders.filter((w) => w.status === "in_progress").length }),
  },
  {
    id: "premade-maintenance-cost",
    title: "Total Maint. Cost",
    subtitle: "Cumulative maintenance spend",
    icon: "ri-money-dollar-circle-line",
    color: "primary",
    compute: () => ({ value: `$${Math.round(totalMaintenanceCost).toLocaleString()}` }),
  },
  {
    id: "premade-avg-downtime",
    title: "Avg Downtime / WO",
    subtitle: "Mean downtime per work order",
    icon: "ri-time-line",
    color: "primary",
    compute: () => ({
      value: `${Math.round(workOrders.reduce((s, w) => s + w.actualHours, 0) / workOrders.length * 10) / 10} hrs`,
    }),
  },
  // Production
  {
    id: "premade-total-production",
    title: "Daily Production",
    subtitle: "Total across all sites (latest)",
    icon: "ri-drop-line",
    color: "secondary",
    compute: () => ({ value: totalDailyProduction.toLocaleString(), unit: "bbl/day" }),
  },
  {
    id: "premade-avg-efficiency",
    title: "Average Efficiency",
    subtitle: "Mean efficiency across all records",
    icon: "ri-speed-up-line",
    color: "secondary",
    compute: () => ({ value: `${avgEfficiency}%` }),
  },
  {
    id: "premade-total-downtime",
    title: "Total Downtime (Jul)",
    subtitle: "Cumulative downtime this month",
    icon: "ri-timer-flash-line",
    color: "secondary",
    compute: () => ({ value: `${totalDowntime} hrs` }),
  },
  {
    id: "premade-total-energy",
    title: "Total Energy Used (Jul)",
    subtitle: "Energy consumption this month",
    icon: "ri-flashlight-line",
    color: "secondary",
    compute: () => ({ value: totalEnergyUsed.toLocaleString(), unit: "kWh" }),
  },
];

// ---- Icon Picker ----

const ICON_OPTIONS = [
  "ri-building-line", "ri-cpu-line", "ri-drop-line", "ri-fire-line",
  "ri-alarm-warning-line", "ri-tools-line", "ri-heart-pulse-line",
  "ri-calendar-check-line", "ri-money-dollar-circle-line", "ri-time-line",
  "ri-shield-check-line", "ri-radar-line", "ri-stack-line", "ri-bar-chart-line",
  "ri-donut-chart-line", "ri-speed-up-line", "ri-close-circle-line",
  "ri-checkbox-circle-line", "ri-error-warning-line", "ri-wifi-line",
  "ri-flashlight-line", "ri-timer-flash-line", "ri-notification-3-line",
  "ri-loader-4-line", "ri-clipboard-line", "ri-check-double-line",
  "ri-first-aid-kit-line", "ri-line-chart-line", "ri-pie-chart-line", "ri-funds-line",
];

const COLOR_OPTIONS: { key: "primary" | "accent" | "secondary"; label: string; dotClass: string }[] = [
  { key: "primary", label: "Brand", dotClass: "bg-primary-500" },
  { key: "accent", label: "Alert", dotClass: "bg-accent-500" },
  { key: "secondary", label: "Neutral", dotClass: "bg-secondary-500" },
];

// ---- Component ----

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  existingIds: string[];
  onAdd: (kpi: KpiItem) => void;
}

type TabId = "premade" | "custom";

export default function AddCardModal({ open, onClose, existingIds, onAdd }: AddCardModalProps) {
  const [tab, setTab] = useState<TabId>("premade");

  // Custom form state
  const [customTitle, setCustomTitle] = useState("");
  const [customSource, setCustomSource] = useState<DataSource>("sites");
  const [customField, setCustomField] = useState("");
  const [customCalc, setCustomCalc] = useState<Calculation>("count");
  const [customItemIds, setCustomItemIds] = useState<string[]>([]);
  const [customIcon, setCustomIcon] = useState("ri-building-line");
  const [customColor, setCustomColor] = useState<"primary" | "accent" | "secondary">("primary");
  const [itemSearch, setItemSearch] = useState("");

  const sourceItems = useMemo(() => getSourceItems(customSource), [customSource]);
  const fields = useMemo(() => SOURCE_FIELDS[customSource], [customSource]);

  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return sourceItems;
    const q = itemSearch.toLowerCase();
    return sourceItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [sourceItems, itemSearch]);

  const previewValue = useMemo(() => {
    if (!customTitle) return null;
    if (customCalc === "count") {
      const config: CustomCardConfig = {
        dataSource: customSource,
        itemIds: customItemIds,
        field: "",
        calculation: "count",
      };
      return computeValue(config);
    }
    if (!customField) return null;
    const config: CustomCardConfig = {
      dataSource: customSource,
      itemIds: customItemIds,
      field: customField,
      calculation: customCalc,
    };
    return computeValue(config);
  }, [customTitle, customSource, customField, customCalc, customItemIds]);

  const toggleItem = (id: string) => {
    setCustomItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (customItemIds.length === sourceItems.length) {
      setCustomItemIds([]);
    } else {
      setCustomItemIds(sourceItems.map((i) => i.id));
    }
  };

  const handleAddPremade = (tpl: PremadeTemplate) => {
    const computed = tpl.compute();
    const kpi: KpiItem = {
      id: tpl.id,
      title: tpl.title,
      value: computed.value,
      unit: computed.unit,
      icon: tpl.icon,
      color: tpl.color,
      pinned: true,
      thresholds: { warning: 0, critical: 0, direction: "above", enabled: false },
    };
    onAdd(kpi);
  };

  const handleAddCustom = () => {
    if (!customTitle.trim()) return;
    const val = previewValue ?? 0;
    const configStr = JSON.stringify({
      dataSource: customSource,
      itemIds: customItemIds,
      field: customField,
      calculation: customCalc,
    });
    const kpi: KpiItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      value: val,
      icon: customIcon,
      color: customColor,
      pinned: true,
      thresholds: { warning: 0, critical: 0, direction: "above", enabled: false },
    };
    onAdd(kpi);
    // Reset form
    setCustomTitle("");
    setCustomSource("sites");
    setCustomField("");
    setCustomCalc("count");
    setCustomItemIds([]);
    setCustomIcon("ri-building-line");
    setCustomColor("primary");
    setItemSearch("");
  };

  const canAddCustom = customTitle.trim().length > 0 && (customCalc === "count" || customField.length > 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-background-50 rounded-xl border border-background-200/70 w-full max-w-[720px] max-h-[85vh] flex flex-col shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-200/70 flex-shrink-0">
          <h2 className="text-lg font-heading font-semibold text-foreground-900">Add Card</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-400 hover:text-foreground-600 hover:bg-background-200 transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex items-center bg-background-200/70 rounded-full p-1 w-fit">
            <button
              onClick={() => setTab("premade")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                tab === "premade"
                  ? "bg-background-50 text-foreground-900"
                  : "text-foreground-500 hover:text-foreground-700"
              }`}
            >
              Premade Cards
            </button>
            <button
              onClick={() => setTab("custom")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                tab === "custom"
                  ? "bg-background-50 text-foreground-900"
                  : "text-foreground-500 hover:text-foreground-700"
              }`}
            >
              Custom Card
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === "premade" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREMADE_TEMPLATES.map((tpl) => {
                const alreadyAdded = existingIds.includes(tpl.id);
                const computed = tpl.compute();
                return (
                  <button
                    key={tpl.id}
                    disabled={alreadyAdded}
                    onClick={() => handleAddPremade(tpl)}
                    className={`text-left rounded-lg border p-4 transition-all ${
                      alreadyAdded
                        ? "border-background-200/70 bg-background-100 opacity-50 cursor-not-allowed"
                        : "border-background-200/70 bg-background-50 hover:border-primary-300 hover:bg-primary-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                        tpl.color === "primary" ? "bg-primary-100 text-primary-600" :
                        tpl.color === "accent" ? "bg-accent-100 text-accent-600" :
                        "bg-secondary-100 text-secondary-600"
                      }`}>
                        <i className={`${tpl.icon} text-base`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground-800 truncate">
                          {tpl.title}
                          {alreadyAdded && <span className="text-xs text-foreground-400 ml-1">(added)</span>}
                        </p>
                        <p className="text-xs text-foreground-400 mt-0.5">{tpl.subtitle}</p>
                      </div>
                      <span className="text-lg font-heading font-semibold text-foreground-900 flex-shrink-0">
                        {computed.value}
                        {computed.unit && <span className="text-xs text-foreground-500 ml-1 font-normal">{computed.unit}</span>}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "custom" && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5">Card Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Average Production at Permian Basin"
                  className="w-full px-3 py-2 text-sm rounded-md border border-background-300 bg-background-50 text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Data Source + Calculation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">Data Source</label>
                  <select
                    value={customSource}
                    onChange={(e) => {
                      setCustomSource(e.target.value as DataSource);
                      setCustomField("");
                      setCustomItemIds([]);
                      setItemSearch("");
                    }}
                    className="w-full px-3 py-2 text-sm rounded-md border border-background-300 bg-background-50 text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                  >
                    {(Object.keys(SOURCE_LABELS) as DataSource[]).map((ds) => (
                      <option key={ds} value={ds}>{SOURCE_LABELS[ds]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">Calculation</label>
                  <select
                    value={customCalc}
                    onChange={(e) => setCustomCalc(e.target.value as Calculation)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-background-300 bg-background-50 text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                  >
                    {(Object.keys(CALC_LABELS) as Calculation[]).map((c) => (
                      <option key={c} value={c}>{CALC_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field (if not count) */}
              {customCalc !== "count" && fields.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">Numeric Field</label>
                  <select
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md border border-background-300 bg-background-50 text-foreground-900 focus:outline-none focus:border-primary-400 transition-colors"
                  >
                    <option value="">Select a field...</option>
                    {fields.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {customCalc !== "count" && fields.length === 0 && (
                <div className="p-3 bg-accent-50 rounded-lg border border-accent-200/50">
                  <p className="text-xs text-accent-700">
                    This data source only supports Count. Try a different source for numeric calculations.
                  </p>
                </div>
              )}

              {/* Item Filter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground-700">
                    Filter Items
                  </label>
                  <button
                    onClick={selectAllItems}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {customItemIds.length === sourceItems.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <p className="text-xs text-foreground-400 mb-2">
                  {customItemIds.length === 0
                    ? "All items included"
                    : `${customItemIds.length} of ${sourceItems.length} selected`}
                </p>
                {sourceItems.length > 8 && (
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="Search items..."
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-background-300 bg-background-50 text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 mb-2 transition-colors"
                  />
                )}
                <div className="max-h-[160px] overflow-y-auto rounded-md border border-background-200/70">
                  {filteredItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors hover:bg-background-100 ${
                        customItemIds.includes(item.id) ? "bg-primary-50/50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={customItemIds.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400"
                      />
                      <span className="text-foreground-800 truncate">{item.label}</span>
                    </label>
                  ))}
                  {filteredItems.length === 0 && (
                    <p className="px-3 py-3 text-xs text-foreground-400 text-center">No items found</p>
                  )}
                </div>
              </div>

              {/* Icon + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">Icon</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setCustomIcon(icon)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                          customIcon === icon
                            ? "bg-primary-100 text-primary-600 ring-1 ring-primary-300"
                            : "text-foreground-400 hover:text-foreground-600 hover:bg-background-200"
                        }`}
                      >
                        <i className={`${icon} text-sm`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5">Color</label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setCustomColor(opt.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                          customColor === opt.key
                            ? "border-foreground-300 bg-background-100"
                            : "border-background-200/70 hover:border-background-300"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${opt.dotClass}`}></div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              {previewValue !== null && (
                <div className="p-4 bg-background-100 rounded-lg border border-background-200/70">
                  <p className="text-xs font-medium text-foreground-500 mb-1">Preview</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${
                      customColor === "primary" ? "bg-primary-100 text-primary-600" :
                      customColor === "accent" ? "bg-accent-100 text-accent-600" :
                      "bg-secondary-100 text-secondary-600"
                    }`}>
                      <i className={`${customIcon} text-base`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-500">{customTitle || "Card Title"}</p>
                      <span className="text-xl font-heading font-semibold text-foreground-900">
                        {typeof previewValue === "number" && previewValue > 999
                          ? previewValue.toLocaleString()
                          : previewValue}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === "custom" && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-background-200/70 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCustom}
              disabled={!canAddCustom}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                canAddCustom
                  ? "bg-primary-500 text-background-50 hover:bg-primary-600"
                  : "bg-background-200 text-foreground-400 cursor-not-allowed"
              }`}
            >
              Add Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}