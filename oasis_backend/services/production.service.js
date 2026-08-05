// services/production.service.js

const { getAll, createDoc, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  scheduleAdherence: 'productionScheduleAdherence',
  hourly: 'productionHourly',
  dailyYield: 'productionDailyYield',
  throughputByAsset: 'productionThroughputByAsset',
  downtimeEvents: 'productionDowntimeEvents',
};

async function getScheduleAdherence() {
  return getAll(COLLECTIONS.scheduleAdherence);
}

async function getHourlyProduction() {
  return getAll(COLLECTIONS.hourly);
}

async function getDailyYield() {
  return getAll(COLLECTIONS.dailyYield);
}

async function getThroughputByAsset() {
  return getAll(COLLECTIONS.throughputByAsset);
}

async function getDowntimeEvents() {
  return getAll(COLLECTIONS.downtimeEvents);
}

async function createScheduleAdherenceEntry(entry) {
  return createDoc(COLLECTIONS.scheduleAdherence, entry);
}

async function seedProductionData(data) {
  await batchSet(COLLECTIONS.scheduleAdherence, data.scheduleAdherence);
  await batchSet(COLLECTIONS.hourly, data.hourly);
  await batchSet(COLLECTIONS.dailyYield, data.dailyYield);
  await batchSet(COLLECTIONS.throughputByAsset, data.throughputByAsset);
  await batchSet(COLLECTIONS.downtimeEvents, data.downtimeEvents);
}

module.exports = {
  COLLECTIONS,
  getScheduleAdherence,
  getHourlyProduction,
  getDailyYield,
  getThroughputByAsset,
  getDowntimeEvents,
  createScheduleAdherenceEntry,
  seedProductionData,
};
