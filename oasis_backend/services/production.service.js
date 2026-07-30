// services/production.service.js

const { getAll, createDoc, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  scheduleAdherence: 'productionScheduleAdherence',
};

async function getScheduleAdherence() {
  return getAll(COLLECTIONS.scheduleAdherence);
}

async function createScheduleAdherenceEntry(entry) {
  return createDoc(COLLECTIONS.scheduleAdherence, entry);
}

async function seedProductionData(data) {
  await batchSet(COLLECTIONS.scheduleAdherence, data.scheduleAdherence);
}

module.exports = { getScheduleAdherence, createScheduleAdherenceEntry, seedProductionData };