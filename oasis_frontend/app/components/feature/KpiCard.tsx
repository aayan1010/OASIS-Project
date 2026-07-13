import type { ReactNode } from "react";
import ThresholdSettings, {
  type AlertThreshold,
  getThresholdStatus,
  parseNumericValue,
} from "./ThresholdSettings";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  color?: "primary" | "accent" | "secondary";
  pinned?: boolean;
  onTogglePin?: () => void;
  thresholds?: AlertThreshold;
  onThresholdsChange?: (t: AlertThreshold) => void;
  children?: ReactNode;
}

export default function KpiCard({
  title,
  value,
  unit,
  change,
  changeType = "neutral",
  icon,
  color = "primary",
  pinned = false,
  onTogglePin,
  thresholds,
  onThresholdsChange,
  children,
}: KpiCardProps) {
  const colorMap = {
    primary: {
      bg: "bg-primary-50",
      iconBg: "bg-primary-100",
      iconText: "text-primary-600",
    },
    accent: {
      bg: "bg-accent-50",
      iconBg: "bg-accent-100",
      iconText: "text-accent-600",
    },
    secondary: {
      bg: "bg-secondary-50",
      iconBg: "bg-secondary-100",
      iconText: "text-secondary-600",
    },
  };

  const changeColor = {
    positive: "text-primary-600",
    negative: "text-accent-600",
    neutral: "text-foreground-500",
  };

  const changeIcon = {
    positive: "ri-arrow-up-line",
    negative: "ri-arrow-down-line",
    neutral: "ri-subtract-line",
  };

  const thresholdStatus =
    thresholds && thresholds.enabled
      ? getThresholdStatus(parseNumericValue(value), thresholds)
      : null;

  const statusBorder = {
    ok: "",
    warning: "border-l-amber-500 border-l-[3px]",
    critical: "border-l-red-500 border-l-[3px]",
  };

  return (
    <div
      className={`relative bg-background-50 rounded-lg border border-background-200/70 p-4 hover:border-background-300/60 transition-colors ${
        thresholdStatus ? statusBorder[thresholdStatus] : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-lg ${colorMap[color].iconBg} ${colorMap[color].iconText}`}
          >
            <i className={`${icon} text-base`}></i>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground-500 uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-heading font-semibold text-foreground-900">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-foreground-500">{unit}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onThresholdsChange && thresholds && (
            <ThresholdSettings
              thresholds={thresholds}
              onChange={onThresholdsChange}
              kpiValue={value}
              kpiTitle={title}
            />
          )}
          {onTogglePin && (
            <button
              onClick={onTogglePin}
              className="text-foreground-400 hover:text-foreground-600 transition-colors"
              title={pinned ? "Unpin" : "Pin"}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i
                  className={`${pinned ? "ri-pushpin-fill" : "ri-pushpin-line"} text-sm`}
                ></i>
              </div>
            </button>
          )}
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${changeIcon[changeType]} text-xs ${changeColor[changeType]}`}></i>
          </div>
          <span className={`text-xs font-medium ${changeColor[changeType]}`}>
            {change}
          </span>
          <span className="text-xs text-foreground-400">vs last period</span>
        </div>
      )}
      {children}
    </div>
  );
}