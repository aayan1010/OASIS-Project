// scripts/seedFirestore.js

const { batchSet } = require('../firebase/firestore');
const { seedFinanceData } = require('../services/finance.service');
const { seedProductionData } = require('../services/production.service');
const { seedLogisticsData } = require('../services/logistics.service');
const { seedSafetyData } = require('../services/safety.service');
const { seedDashboardData } = require('../services/dashboard.service');

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

  console.log('Seeding alert type breakdown...');
  await batchSet('alertTypeBreakdown', withId(alertTypeBreakdown, 'type'));

  console.log('Seeding sites...');
  await batchSet('sites', sites);

  console.log('Seeding work orders...');
  await batchSet('workOrders', workOrders);

  console.log('Seeding maintenance calendar events...');
  await batchSet('maintenanceCalendarEvents', withId(calendarEvents, 'id'));

  console.log('Seeding maintenance work order columns...');
  await batchSet('maintenanceWorkOrderColumns', withId(workOrderColumns, 'id'));

  console.log('Seeding finance data...');
  await seedFinanceData({
    monthlyBudget: withId(monthlyBudget, 'month'),
    opexBreakdown: withId(opexBreakdown, 'category'),
    revenueStreams: withId(revenueStreams, 'stream'),
    costPerUnit: withId(costPerUnit, 'asset'),
    capexProjects,
    monthlyRevenue: withId(monthlyRevenueData, 'month'),
  });

  console.log('Seeding production data...');
  await seedProductionData({
    scheduleAdherence: withId(scheduleAdherence, 'shift'),
    hourly: withId(hourlyProduction, 'hour'),
    // date values contain "/" which is not a valid Firestore doc id, use index
    dailyYield: withId(dailyYieldComparison, null),
    throughputByAsset: withId(throughputByAsset, 'asset'),
    downtimeEvents: withId(downtimeEvents, 'id'),
  });

  console.log('Seeding logistics data...');
  await seedLogisticsData({
    inventory: withId(inventoryItems, 'id'),
    shipments: withId(shipments, 'id'),
    warehouses: withId(warehouses, 'id'),
    deliveryPerformance: withId(deliveryPerformance, 'carrier'),
    supplyChainAlerts: withId(supplyChainAlerts, 'id'),
  });

  console.log('Seeding safety data...');
  await seedSafetyData({
    incidents: withId(safetyIncidents, 'id'),
    monthlyIncidents: withId(monthlyIncidents, 'month'),
    complianceCategories: withId(complianceCategories, 'category'),
    // type values contain "/" which is not a valid Firestore doc id, use index
    hazardTypes: withId(hazardTypes, null),
    drills: withId(safetyDrills, 'id'),
    inspections: withId(inspectionsData, 'id'),
  });

  console.log('Seeding dashboard data...');
  await seedDashboardData({
    navigation: withId(navigationItems, 'id'),
    kpis: withId(dashboardKpiData, 'id'),
    quickActions: withId(quickActions, 'id'),
    sectorOverview: withId(sectorOverview, 'id'),
  });

  console.log('Seeding AST-0001 sensor time series...');
  const sensorReadings = ast0001TimeSeries.map(
    ([timestamp, temperature, pressure, vibration, flowRate, power, oilLevel]) => ({
      id: timestamp,
      assetId: 'AST-0001',
      timestamp,
      temperature,
      pressure,
      vibration,
      flowRate,
      power,
      oilLevel,
    })
  );
  await batchSet('sensorAst0001TimeSeries', sensorReadings);

  console.log('Done! Firestore is populated.');
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
