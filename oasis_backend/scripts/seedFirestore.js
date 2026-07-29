// scripts/seedFirestore.js

const { batchSet } = require('../firebase/firestore');
const { seedFinanceData } = require('../services/finance.service');
const { seedProductionData } = require('../services/production.service');

const {
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
} = require('./seedData');

function withId(items, keyField) {
  return items.map((item, i) => ({
    ...item,
    id: keyField ? String(item[keyField]) : String(i),
  }));
}

async function main() {
  console.log('Seeding assets...');
  await batchSet('assets', assetLocations);

  console.log('Seeding telemetry...');
  await batchSet('telemetry', telemetryStreams);

  console.log('Seeding alerts...');
  await batchSet('alerts', alertRecords);

  console.log('Seeding sites...');
  await batchSet('sites', sites);

  console.log('Seeding work orders...');
  await batchSet('workOrders', workOrders);

  console.log('Seeding finance data...');
  await seedFinanceData({
    monthlyBudget: withId(monthlyBudget, 'month'),
    opexBreakdown: withId(opexBreakdown, 'category'),
    revenueStreams: withId(revenueStreams, 'stream'),
    costPerUnit: withId(costPerUnit, 'asset'),
    capexProjects,
  });

  console.log('Seeding production data...');
  await seedProductionData({
    scheduleAdherence: withId(scheduleAdherence, 'shift'),
  });

  console.log('Done! Firestore is populated.');
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});