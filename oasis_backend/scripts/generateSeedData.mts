// scripts/generateSeedData.mts
// Generates seedData.json from the frontend mock data so the Firestore seed
// uses the exact same data the UI was designed around.
// Run with: npx tsx scripts/generateSeedData.mts

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { assetLocations, telemetryStreams } from "../../oasis_frontend/app/mocks/assets";
import { alertRecords } from "../../oasis_frontend/app/mocks/alerts";
import { sites } from "../../oasis_frontend/app/mocks/sites";
import { workOrders } from "../../oasis_frontend/app/mocks/maintenance";
import {
  monthlyBudget,
  opexBreakdown,
  revenueStreams,
  costPerUnit,
  capexProjects,
} from "../../oasis_frontend/app/mocks/finance";
import { scheduleAdherence } from "../../oasis_frontend/app/mocks/production";

const data = {
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
};

const outPath = join(dirname(fileURLToPath(import.meta.url)), "seedData.json");
// JSON.stringify drops `undefined` values, which Firestore rejects anyway.
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log("Wrote seedData.json:");
for (const [key, value] of Object.entries(data)) {
  console.log(`  ${key}: ${Array.isArray(value) ? value.length : "?"} items`);
}
