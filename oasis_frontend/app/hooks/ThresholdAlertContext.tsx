import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AlertThreshold } from "../components/feature/ThresholdSettings";
import { parseNumericValue, getThresholdStatus } from "../components/feature/ThresholdSettings";

export interface ThresholdBreachAlert {
  id: string;
  title: string;
  severity: "high" | "medium";
  module: string;
  time: string;
  status: "active";
  source: "threshold";
  kpiTitle: string;
  level: "warning" | "critical";
  value: string | number;
}

interface KpiThresholdInput {
  id: string;
  title: string;
  value: string | number;
  thresholds: AlertThreshold;
}

interface ThresholdAlertContextType {
  breachAlerts: ThresholdBreachAlert[];
  syncPageKpis: (page: string, kpis: KpiThresholdInput[]) => void;
  clearPageKpis: (page: string) => void;
}

const ThresholdAlertContext = createContext<ThresholdAlertContextType>({
  breachAlerts: [],
  syncPageKpis: () => {},
  clearPageKpis: () => {},
});

export function ThresholdAlertProvider({ children }: { children: ReactNode }) {
  const [pageStates, setPageStates] = useState<
    Record<string, KpiThresholdInput[]>
  >({});

  const syncPageKpis = useCallback(
    (page: string, kpis: KpiThresholdInput[]) => {
      setPageStates((prev) => ({ ...prev, [page]: kpis }));
    },
    []
  );

  const clearPageKpis = useCallback((page: string) => {
    setPageStates((prev) => {
      const next = { ...prev };
      delete next[page];
      return next;
    });
  }, []);

  const breachAlerts: ThresholdBreachAlert[] = Object.entries(pageStates).flatMap(
    ([page, kpis]) =>
      kpis
        .filter((kpi) => kpi.thresholds.enabled)
        .map((kpi) => {
          const numericValue = parseNumericValue(kpi.value);
          const status = getThresholdStatus(numericValue, kpi.thresholds);
          if (status === "ok") return null;

          const level = status === "critical" ? "critical" : "warning";
          const severity = status === "critical" ? "high" : "medium";
          const direction = kpi.thresholds.direction === "below" ? "<" : ">";
          const thresholdValue =
            status === "critical"
              ? kpi.thresholds.critical
              : kpi.thresholds.warning;

          return {
            id: `threshold-${page}-${kpi.id}-${level}`,
            title: `${kpi.title}: ${level === "critical" ? "Critical" : "Warning"} threshold breached (${kpi.value} ${direction} ${thresholdValue})`,
            severity,
            module: page === "overview" ? "Overview" : "Performance",
            time: "Just now",
            status: "active" as const,
            source: "threshold" as const,
            kpiTitle: kpi.title,
            level,
            value: kpi.value,
          };
        })
        .filter(Boolean) as ThresholdBreachAlert[]
  );

  return (
    <ThresholdAlertContext.Provider
      value={{ breachAlerts, syncPageKpis, clearPageKpis }}
    >
      {children}
    </ThresholdAlertContext.Provider>
  );
}

export function useThresholdAlerts() {
  return useContext(ThresholdAlertContext);
}