// scripts/generateSeedData.mts
// Generates seedData.json from the frontend mock data so the Firestore seed
// uses the exact same data the UI was designed around.
// Run with: npx tsx scripts/generateSeedData.mts

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { assetLocations, telemetryStreams } from "../../oasis_frontend/app/mocks/assets";
import { alertRecords, alertTypeBreakdown } from "../../oasis_frontend/app/mocks/alerts";
import { sites } from "../../oasis_frontend/app/mocks/sites";
import { workOrders, calendarEvents, workOrderColumns } from "../../oasis_frontend/app/mocks/maintenance";
import {
  monthlyBudget,
  opexBreakdown,
  revenueStreams,
  costPerUnit,
  capexProjects,
  monthlyRevenueData,
} from "../../oasis_frontend/app/mocks/finance";
import {
  scheduleAdherence,
  hourlyProduction,
  dailyYieldComparison,
  throughputByAsset,
  downtimeEvents,
} from "../../oasis_frontend/app/mocks/production";
import {
  inventoryItems,
  shipments,
  warehouses,
  deliveryPerformance,
  supplyChainAlerts,
} from "../../oasis_frontend/app/mocks/logistics";
import {
  safetyIncidents,
  monthlyIncidents,
  complianceCategories,
  hazardTypes,
  safetyDrills,
  inspectionsData,
} from "../../oasis_frontend/app/mocks/safety";
import {
  navigationItems,
  dashboardKpiData,
  quickActions,
  sectorOverview,
} from "../../oasis_frontend/app/mocks/dashboard";
import { ast0001TimeSeries } from "../../oasis_frontend/app/mocks/sensorData";

const data = {
  // Already-seeded core collections (kept so a fresh seed reproduces everything)
  assetLocations,
  telemetryStreams,
  alertRecords,
  sites,
  workOrders,
  monthlyBudget,
  opexBreakdown,
  revenueStreams,
  costPerUnit,
  capexProjects,
  scheduleAdherence,

  // Remaining datasets
  alertTypeBreakdown,
  calendarEvents,
  workOrderColumns,
  monthlyRevenueData,
  hourlyProduction,
  dailyYieldComparison,
  throughputByAsset,
  downtimeEvents,
  inventoryItems,
  shipments,
  warehouses,
  deliveryPerformance,
  supplyChainAlerts,
  safetyIncidents,
  monthlyIncidents,
  complianceCategories,
  hazardTypes,
  safetyDrills,
  inspectionsData,
  navigationItems,
  dashboardKpiData,
  quickActions,
  sectorOverview,
  ast0001TimeSeries,
};

const outPath = join(dirname(fileURLToPath(import.meta.url)), "seedData.json");
// JSON.stringify drops `undefined` values, which Firestore rejects anyway.
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log("Wrote seedData.json:");
for (const [key, value] of Object.entries(data)) {
  console.log(`  ${key}: ${Array.isArray(value) ? value.length : "?"} items`);
}
