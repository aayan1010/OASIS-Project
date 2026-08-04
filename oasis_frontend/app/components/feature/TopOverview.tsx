"use client";

import type { ReactNode } from "react";
import KpiCard from "./KpiCard";
import type { AlertThreshold } from "./ThresholdSettings";

interface ViewToggleOption {
  id: string;
  label: string;
  icon: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color?: "primary" | "accent" | "secondary";
  onClick?: () => void;
}

interface KpiData {
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

interface TopOverviewProps {
  kpis: KpiData[];
  onTogglePin?: (id: string) => void;
  onThresholdsChange?: (id: string, t: AlertThreshold) => void;
  onAddCard?: () => void;
  onRemoveCard?: (id: string) => void;
  quickActions?: QuickAction[];
  viewToggle?: {
    options: ViewToggleOption[];
    activeView: string;
    onChange: (id: string) => void;
  };
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function TopOverview({
  kpis,
  onTogglePin,
  onThresholdsChange,
  onAddCard,
  onRemoveCard,
  quickActions,
  viewToggle,
  children,
  title,
  subtitle,
}: TopOverviewProps) {
  const pinnedKpis = kpis.filter((k) => k.pinned);
  const unpinnedKpis = kpis.filter((k) => !k.pinned);

  const actionColorMap = {
    primary: "bg-primary-500 text-background-50 hover:bg-primary-600",
    accent: "bg-accent-500 text-background-50 hover:bg-accent-600",
    secondary: "bg-secondary-500 text-background-50 hover:bg-secondary-600",
  };

  return (
    <div className="bg-background-100 border-b border-background-200/70">
      <div className="px-6 py-5">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h1 className="text-xl font-heading font-semibold text-foreground-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-foreground-500 mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {pinnedKpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {pinnedKpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                unit={kpi.unit}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
                pinned={kpi.pinned}
                onTogglePin={() => onTogglePin?.(kpi.id)}
                onRemove={onRemoveCard ? () => onRemoveCard(kpi.id) : undefined}
                thresholds={kpi.thresholds}
                onThresholdsChange={
                  onThresholdsChange
                    ? (t) => onThresholdsChange(kpi.id, t)
                    : undefined
                }
              />
            ))}
            {onAddCard && (
              <button
                onClick={onAddCard}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-background-300/80 hover:border-primary-300 hover:bg-primary-50/20 p-4 transition-colors min-h-[120px] cursor-pointer"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-background-200 text-foreground-400 group-hover:bg-primary-100 group-hover:text-primary-500">
                  <i className="ri-add-line text-lg"></i>
                </div>
                <span className="text-xs font-medium text-foreground-400">Add Card</span>
              </button>
            )}
          </div>
        )}

        {pinnedKpis.length === 0 && onAddCard && (
          <div className="mb-4">
            <button
              onClick={onAddCard}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-background-300/80 hover:border-primary-300 hover:bg-primary-50/20 p-6 transition-colors w-full max-w-[280px] cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background-200 text-foreground-400">
                <i className="ri-add-line text-xl"></i>
              </div>
              <span className="text-sm font-medium text-foreground-500">Add your first card</span>
              <span className="text-xs text-foreground-400">Choose from premade templates or create a custom card</span>
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {quickActions && quickActions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    actionColorMap[action.color || "primary"]
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${action.icon} text-sm`}></i>
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {viewToggle && (
            <div className="flex items-center bg-background-200/70 rounded-full p-1 ml-auto">
              {viewToggle.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => viewToggle.onChange(option.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    viewToggle.activeView === option.id
                      ? "bg-background-50 text-foreground-900 shadow-sm"
                      : "text-foreground-500 hover:text-foreground-700"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${option.icon} text-xs`}></i>
                  </div>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}