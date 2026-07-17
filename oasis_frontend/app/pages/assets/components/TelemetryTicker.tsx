"use client";

import { telemetryStreams, sectorColors, type TelemetrySensor, getRecentSeries } from "../../../mocks/assets";
import { useState, useEffect, useMemo, useCallback } from "react";

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  critical: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function Sparkline({ data, color = "#64748b" }: { data: number[]; color?: string }) {
  const width = 56;
  const height = 18;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function sparklineFor(sensor: TelemetrySensor): number[] | null {
  const name = sensor.sensorName.toLowerCase();
  const type = sensor.sensorType.toLowerCase();
  if (sensor.assetId !== "AST-0001") return null;
  if (name.includes("temperature") || type.includes("temperature")) return getRecentSeries(1, 24);
  if (name.includes("pressure") || type.includes("pressure")) return getRecentSeries(2, 24);
  if (name.includes("vibration") || type.includes("accelerometer")) return getRecentSeries(3, 24);
  if (name.includes("flow") || type.includes("flow")) return getRecentSeries(4, 24);
  if (name.includes("power") || type.includes("power")) return getRecentSeries(5, 24);
  if (name.includes("oil") || type.includes("oil")) return getRecentSeries(6, 24);
  return null;
}

const tickerItem = (sensor: TelemetrySensor, index: number) => {
  const statusStyle = statusStyles[sensor.status];
  const sectorStyle = sectorColors[sensor.sector];
  const trendIcon =
    sensor.trend === "up"
      ? "ri-arrow-up-line text-green-500"
      : sensor.trend === "down"
      ? "ri-arrow-down-line text-red-500"
      : "ri-subtract-line text-foreground-400";

  return (
    <div
      key={`${sensor.id}-${index}`}
      className="inline-flex items-center gap-3 px-4 py-2.5 bg-background-50 rounded-lg border border-background-200/70 flex-shrink-0 min-w-[280px] hover:border-primary-200/60 hover:bg-background-100/50 transition-colors"
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${sectorStyle.bg} ${sectorStyle.border}`}>
        <i className={`ri-sensor-line text-sm ${sectorStyle.text}`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground-900 truncate">{sensor.assetName}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
            {sensor.status}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-foreground-500">{sensor.sensorName}</span>
          <span className="text-foreground-300 text-[10px]">·</span>
          <span className="text-xs font-mono font-semibold text-foreground-900">
            {sensor.value}
            <span className="text-foreground-400 font-normal ml-0.5">{sensor.unit}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="w-3 h-3 flex items-center justify-center">
            <i className={`${trendIcon} text-xs`}></i>
          </div>
          <span
            className={`text-[10px] font-medium ${
              sensor.trend === "up"
                ? "text-green-600"
                : sensor.trend === "down"
                ? "text-red-600"
                : "text-foreground-500"
            }`}
          >
            {sensor.trendPct}
          </span>
          <span className="text-foreground-300 text-[10px]">·</span>
          <span className="text-[10px] text-foreground-400">{sensor.lastUpdate}</span>
        </div>
      </div>
      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{
        backgroundColor:
          sensor.status === "critical" ? "#ef4444" :
          sensor.status === "warning" ? "#f59e0b" :
          "#22c55e"
      }}></div>
    </div>
  );
};

export default function TelemetryTicker() {
  const [tickerVersion, setTickerVersion] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const shuffledData = useMemo(() => {
    const shuffled = shuffleArray(telemetryStreams);
    return [...shuffled, ...shuffleArray(telemetryStreams)];
  }, [tickerVersion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVersion((v) => v + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredSensors = useMemo(() => {
    return telemetryStreams.filter((s) => {
      if (selectedSector !== "all" && s.sector !== selectedSector) return false;
      if (selectedStatus !== "all" && s.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedSector, selectedStatus]);

  const stats = useMemo(() => {
    const total = telemetryStreams.length;
    const normal = telemetryStreams.filter((s) => s.status === "normal").length;
    const warning = telemetryStreams.filter((s) => s.status === "warning").length;
    const critical = telemetryStreams.filter((s) => s.status === "critical").length;
    return { total, normal, warning, critical };
  }, []);

  const getStatusCount = useCallback((status: string) => {
    return telemetryStreams.filter((s) => s.status === status).length;
  }, []);

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ticker-scroll-2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker-scroll 40s linear infinite; }
        .ticker-track-2 { animation: ticker-scroll-2 35s linear infinite; }
        .ticker-wrapper:hover .ticker-track,
        .ticker-wrapper:hover .ticker-track-2 { animation-play-state: paused; }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-background-50 rounded-xl border border-background-200/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-500 font-medium">Total Channels</p>
              <p className="text-2xl font-heading font-bold text-foreground-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-lg">
              <i className="ri-signal-tower-line text-lg text-primary-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-background-50 rounded-xl border border-background-200/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-500 font-medium">Normal</p>
              <p className="text-2xl font-heading font-bold text-green-600 mt-1">{stats.normal}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
              <i className="ri-check-line text-lg text-green-600"></i>
            </div>
          </div>
          <div className="mt-2 w-full bg-background-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats.normal / stats.total) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-background-50 rounded-xl border border-background-200/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-500 font-medium">Warning</p>
              <p className="text-2xl font-heading font-bold text-amber-600 mt-1">{stats.warning}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg">
              <i className="ri-error-warning-line text-lg text-amber-600"></i>
            </div>
          </div>
          <div className="mt-2 w-full bg-background-200 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(stats.warning / stats.total) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-background-50 rounded-xl border border-background-200/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-500 font-medium">Critical</p>
              <p className="text-2xl font-heading font-bold text-red-600 mt-1">{stats.critical}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
              <i className="ri-alarm-warning-line text-lg text-red-600"></i>
            </div>
          </div>
          <div className="mt-2 w-full bg-background-200 rounded-full h-1.5">
            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(stats.critical / stats.total) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-secondary-100 rounded-lg">
              <i className="ri-radar-line text-sm text-secondary-600"></i>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground-900">Live Sensor Feed</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                <span className="text-[10px] text-green-600 font-medium">Streaming live data</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-md border border-background-200/70 bg-background-50 text-foreground-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
            >
              <option value="all">All Sectors</option>
              <option value="oil">Oil &amp; Gas</option>
            </select>
          </div>
        </div>

        <div className="ticker-wrapper overflow-hidden py-3 border-b border-background-100">
          <div className="ticker-track flex gap-3 px-3">
            {shuffledData.map((sensor, i) => tickerItem(sensor, i))}
          </div>
        </div>

        <div className="ticker-wrapper overflow-hidden py-3">
          <div className="ticker-track-2 flex gap-3 px-3" style={{ animationDirection: "reverse" }}>
            {[...shuffledData].reverse().map((sensor, i) => tickerItem(sensor, i + 100))}
          </div>
        </div>
      </div>

      <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200/70 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground-900">Detailed Telemetry Table</h4>
            <p className="text-xs text-foreground-500 mt-0.5">{filteredSensors.length} sensor channels</p>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-md border border-background-200/70 bg-background-50 text-foreground-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
          >
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200/70 bg-background-100/50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider">Asset</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider">Sensor</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider hidden sm:table-cell">24h</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider">Trend</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider hidden md:table-cell">Last Update</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground-500 uppercase tracking-wider hidden md:table-cell">Sector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {filteredSensors.map((sensor) => {
                const statusStyle = statusStyles[sensor.status];
                const trendIcon =
                  sensor.trend === "up"
                    ? "ri-arrow-up-line text-green-500"
                    : sensor.trend === "down"
                    ? "ri-arrow-down-line text-red-500"
                    : "ri-subtract-line text-foreground-400";

                return (
                  <tr
                    key={sensor.id}
                    className={`hover:bg-background-100/50 transition-colors cursor-pointer ${
                      expandedSensor === sensor.id ? "bg-primary-50/30" : ""
                    }`}
                    onClick={() => setExpandedSensor(expandedSensor === sensor.id ? null : sensor.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-foreground-900">{sensor.assetName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground-600">{sensor.sensorName}</span>
                      <span className="text-[10px] text-foreground-400 ml-1 hidden sm:inline">({sensor.sensorType})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-foreground-900">
                        {sensor.value}
                        <span className="text-foreground-400 font-normal ml-0.5">{sensor.unit}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {(() => {
                        const data = sparklineFor(sensor);
                        const color = sensor.status === "critical" ? "#ef4444" : sensor.status === "warning" ? "#f59e0b" : "#22c55e";
                        return data && data.length > 1 ? <Sparkline data={data} color={color} /> : <span className="text-xs text-foreground-300">—</span>;
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 flex items-center justify-center">
                          <i className={`${trendIcon} text-xs`}></i>
                        </div>
                        <span
                          className={`text-[10px] font-medium ${
                            sensor.trend === "up"
                              ? "text-green-600"
                              : sensor.trend === "down"
                              ? "text-red-600"
                              : "text-foreground-500"
                          }`}
                        >
                          {sensor.trendPct}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {sensor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-foreground-400">{sensor.lastUpdate}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-foreground-500 capitalize">{sensor.sector}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}