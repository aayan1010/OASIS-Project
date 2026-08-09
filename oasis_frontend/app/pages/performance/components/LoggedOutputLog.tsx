"use client";

import { useMemo } from "react";
import { useProductionRecords, type ProductionDailyRecord } from "../../../lib/api";
import { sites } from "../../../mocks/sites";

function toDateStr(d: ProductionDailyRecord["date"]): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (typeof d === "object" && "_seconds" in d) {
    return new Date(d._seconds * 1000).toISOString().slice(0, 10);
  }
  return String(d);
}

function siteName(id: string): string {
  return sites.find((s) => s.id === id)?.name ?? id;
}

export default function LoggedOutputLog() {
  const { data: records } = useProductionRecords();

  const sorted = useMemo(
    () =>
      [...records]
        .sort((a, b) => toDateStr(b.date).localeCompare(toDateStr(a.date)))
        .slice(0, 8),
    [records],
  );

  return (
    <div className="bg-background-50 rounded-lg border border-background-200/70 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
            <i className="ri-add-circle-line text-primary-600 text-lg"></i>
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground-900">
              Logged Output
            </h3>
            <p className="text-xs text-foreground-500">
              Most recent daily production entries
            </p>
          </div>
        </div>
        <span className="text-xs text-foreground-400 bg-background-100 rounded-full px-3 py-1">
          {records.length} total
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-background-100 mb-3">
            <i className="ri-inbox-line text-foreground-400 text-xl"></i>
          </div>
          <p className="text-sm font-medium text-foreground-700">No output logged yet</p>
          <p className="text-xs text-foreground-500 mt-1">
            Use the &quot;Log Output&quot; action to record daily production.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-foreground-500 border-b border-background-200/70">
                <th className="pb-2 pr-4 font-medium">Date</th>
                <th className="pb-2 pr-4 font-medium">Site</th>
                <th className="pb-2 pr-4 font-medium text-right">Actual</th>
                <th className="pb-2 pr-4 font-medium text-right">Target</th>
                <th className="pb-2 pr-4 font-medium text-right">Efficiency</th>
                <th className="pb-2 font-medium text-right">Downtime</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const efficiency = r.efficiency_percentage ?? 0;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-background-200/40 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-foreground-700 whitespace-nowrap">
                      {toDateStr(r.date)}
                    </td>
                    <td className="py-2.5 pr-4 text-foreground-700 whitespace-nowrap">
                      {siteName(r.site_id)}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-foreground-900 font-medium">
                      {Math.round(r.actual_production ?? 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-foreground-600">
                      {Math.round(r.production_target ?? 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <span
                        className={
                          efficiency >= 95
                            ? "text-emerald-600"
                            : efficiency >= 85
                              ? "text-amber-600"
                              : "text-accent-600"
                        }
                      >
                        {efficiency}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-foreground-600">
                      {r.downtime_hours ?? 0} hrs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
