"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { assetLocations, assetTypeIcons, type AssetLocation } from "../../../mocks/assets";

const statusConfig: Record<string, { dot: string; label: string }> = {
  online: { dot: "#22c55e", label: "Online" },
  degraded: { dot: "#f59e0b", label: "Degraded" },
  offline: { dot: "#ef4444", label: "Offline" },
  maintenance: { dot: "#60a5fa", label: "Maintenance" },
};

const sectorMarkerColors: Record<string, { bg: string; border: string; icon: string }> = {
  oil: { bg: "#e2e8f0", border: "#cbd5e1", icon: "#475569" },
};

const typeLabels: Record<string, string> = {
  "pump-jack": "Pump Jack",
  compressor: "Compressor",
  pipeline: "Pipeline",
  "storage-tank": "Storage Tank",
  wellhead: "Wellhead",
  separator: "Separator",
  "flare-stack": "Flare Stack",
  "gas-plant": "Gas Plant",
};

function createAssetIcon(asset: AssetLocation, isSelected: boolean): L.DivIcon {
  const colors = sectorMarkerColors[asset.sector];
  const dotColor = statusConfig[asset.status]?.dot ?? "#94a3b8";
  const size = isSelected ? 42 : 32;
  const iconSize = isSelected ? 16 : 13;
  const dotSize = isSelected ? 12 : 10;
  const ringWidth = isSelected ? 3 : 0;

  return L.divIcon({
    className: "asset-leaflet-marker",
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      background:${colors.bg};
      border:2px solid ${colors.border};
      box-shadow:0 2px 8px rgba(0,0,0,0.15)${isSelected ? ",0 0 0 ${ringWidth}px #ffffff,0 0 0 ${ringWidth + 2}px " + colors.border : ""};
      position:relative;
      transition:all 0.2s ease;
      cursor:pointer;
    ">
      <i class="${assetTypeIcons[asset.type]}" style="font-size:${iconSize}px;color:${colors.icon};line-height:1;"></i>
      <div style="
        position:absolute;top:-2px;right:-2px;
        width:${dotSize}px;height:${dotSize}px;
        border-radius:50%;
        background:${dotColor};
        border:2px solid #fff;
      "></div>
    </div>`,
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size + 8) / 2 - 4],
  });
}

function buildOSMUrl(assets: AssetLocation[]): string {
  if (assets.length === 0) return "https://www.openstreetmap.org/#map=5/35.5/-97.5";
  if (assets.length === 1) return `https://www.openstreetmap.org/?mlat=${assets[0].lat}&mlon=${assets[0].lng}#map=14/${assets[0].lat}/${assets[0].lng}`;
  return "https://www.openstreetmap.org/#map=5/35.5/-97.5";
}

function MapController({ selectedAsset }: { selectedAsset: AssetLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedAsset) {
      map.flyTo([selectedAsset.lat, selectedAsset.lng], 13, { duration: 0.8 });
    }
  }, [selectedAsset, map]);

  return null;
}

export default function GISMapView() {
  const [selectedAsset, setSelectedAsset] = useState<AssetLocation | null>(null);
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return assetLocations.filter((a) => {
      if (filterSector !== "all" && a.sector !== filterSector) return false;
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      return true;
    });
  }, [filterSector, filterStatus]);

  const statsByStatus = useMemo(
    () => ({
      online: assetLocations.filter((a) => a.status === "online").length,
      degraded: assetLocations.filter((a) => a.status === "degraded").length,
      offline: assetLocations.filter((a) => a.status === "offline").length,
      maintenance: assetLocations.filter((a) => a.status === "maintenance").length,
    }),
    [],
  );

  const osmUrl = useMemo(() => buildOSMUrl(filteredAssets), [filteredAssets]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Map Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-background-200/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-lg">
                <i className="ri-map-pin-line text-sm text-primary-600"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground-900">Asset Location Map</h3>
                <p className="text-xs text-foreground-500">8 Sites — TX, ND, OK, PA, TX (Gulf)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-md border border-background-200/70 bg-background-50 text-foreground-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
                >
                  <option value="all">All Sectors</option>
                  <option value="oil">Oil &amp; Gas</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-md border border-background-200/70 bg-background-50 text-foreground-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="degraded">Degraded</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <span className="text-xs text-foreground-400">
                {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="relative w-full h-[520px] bg-background-200/30">
            <MapContainer
              center={[35.5, -97.5]}
              zoom={5}
              className="w-full h-full"
              zoomControl={true}
              scrollWheelZoom={true}
              doubleClickZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" rel="nofollow">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController selectedAsset={selectedAsset} />
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <Marker
                    key={asset.id}
                    position={[asset.lat, asset.lng]}
                    icon={createAssetIcon(asset, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedAsset(isSelected ? null : asset),
                    }}
                  >
                    <Popup
                      minWidth={240}
                      maxWidth={280}
                      className="asset-detail-popup"
                    >
                      <div className="px-1 py-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-lg border"
                            style={{
                              background: sectorMarkerColors[asset.sector].bg,
                              borderColor: sectorMarkerColors[asset.sector].border,
                            }}
                          >
                            <i
                              className={assetTypeIcons[asset.type]}
                              style={{
                                fontSize: "14px",
                                color: sectorMarkerColors[asset.sector].icon,
                                lineHeight: 1,
                              }}
                            ></i>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-gray-400 capitalize leading-tight">
                              {asset.sector} &middot; {typeLabels[asset.type]}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Status</span>
                            <span
                              className="flex items-center gap-1.5 font-medium"
                              style={{ color: statusConfig[asset.status]?.dot }}
                            >
                              <span
                                className="inline-block w-1.5 h-1.5 rounded-full"
                                style={{ background: statusConfig[asset.status]?.dot }}
                              ></span>
                              {statusConfig[asset.status]?.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Criticality</span>
                            <span
                              className={`font-medium capitalize ${
                                asset.criticality === "critical"
                                  ? "text-red-600"
                                  : asset.criticality === "high"
                                    ? "text-amber-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {asset.criticality}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Coordinates</span>
                            <span className="text-gray-500 font-mono text-[10px]">
                              {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Last Reading</span>
                            <span className="text-gray-500">{asset.lastReading}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 text-xs font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
            >
              <i className="ri-external-link-line text-xs"></i>
              View in OpenStreetMap
            </a>
          </div>

          <div className="flex items-center gap-5 px-4 py-2.5 border-t border-background-200/70 overflow-x-auto">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-foreground-500 font-medium">Legend:</span>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5 whitespace-nowrap">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: cfg.dot }}
                  ></div>
                  <span className="text-foreground-600">{cfg.label}</span>
                  <span className="text-foreground-400">
                    ({statsByStatus[key as keyof typeof statsByStatus]})
                  </span>
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-background-200/70 hidden sm:block"></div>
            <div className="items-center gap-3 text-xs hidden sm:flex">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded border"
                  style={{
                    background: sectorMarkerColors.oil.bg,
                    borderColor: sectorMarkerColors.oil.border,
                  }}
                ></div>
                <span className="text-foreground-600">Oil &amp; Gas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
          <div className="px-4 py-3 border-b border-background-200/70">
            <h4 className="text-sm font-semibold text-foreground-900">Asset Registry</h4>
            <p className="text-xs text-foreground-500 mt-0.5">
              {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""} visible
              &mdash; click for details
            </p>
          </div>
          <div className="divide-y divide-background-100 max-h-[468px] overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <i className="ri-search-line text-2xl text-foreground-300 mb-2"></i>
                <p className="text-sm text-foreground-500">No assets match filters</p>
                <button
                  onClick={() => {
                    setFilterSector("all");
                    setFilterStatus("all");
                  }}
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const dotColor = statusConfig[asset.status]?.dot ?? "#94a3b8";
                const isSelected = selectedAsset?.id === asset.id;
                const isHovered = hoveredAssetId === asset.id;

                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAsset(isSelected ? null : asset)}
                    onMouseEnter={() => setHoveredAssetId(asset.id)}
                    onMouseLeave={() => setHoveredAssetId(null)}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      isSelected
                        ? "bg-primary-50/60 border-l-2 border-l-primary-400"
                        : isHovered
                          ? "bg-background-100/60"
                          : "hover:bg-background-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-transform duration-200 ${
                            isSelected ? "scale-110" : ""
                          }`}
                          style={{
                            background: sectorMarkerColors[asset.sector].bg,
                            borderColor: sectorMarkerColors[asset.sector].border,
                          }}
                        >
                          <i
                            className={assetTypeIcons[asset.type]}
                            style={{
                              fontSize: "14px",
                              color: sectorMarkerColors[asset.sector].icon,
                              lineHeight: 1,
                            }}
                          ></i>
                        </div>
                        <div
                          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ background: dotColor }}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground-900 truncate">
                            {asset.name}
                          </span>
                          {asset.criticality === "critical" && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-medium flex-shrink-0">
                              CRIT
                            </span>
                          )}
                          {asset.criticality === "high" && (
                            <span className="text-[10px] bg-amber-100 text-amber-600 px-1 py-0.5 rounded font-medium flex-shrink-0">
                              HIGH
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-foreground-400 capitalize">
                            {asset.sector}
                          </span>
                          <span className="text-foreground-300 text-[10px]">&middot;</span>
                          <span className="text-xs text-foreground-400">
                            {typeLabels[asset.type]}
                          </span>
                          <span className="text-foreground-300 text-[10px]">&middot;</span>
                          <span className="text-[10px] text-foreground-500 font-mono">
                            {asset.lat.toFixed(2)}, {asset.lng.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <i
                        className={`ri-arrow-right-s-line text-foreground-300 text-sm transition-transform duration-200 ${
                          isSelected ? "rotate-90 text-primary-500" : ""
                        }`}
                      ></i>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-background-200/70 bg-background-100/30">
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full text-xs font-medium text-foreground-600 hover:text-foreground-900 transition-colors whitespace-nowrap"
            >
              <i className="ri-external-link-line text-xs"></i>
              Open all {filteredAssets.length} assets in OpenStreetMap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}