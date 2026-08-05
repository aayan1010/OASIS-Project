// services/safety.service.js

const { getAll, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  incidents: 'safetyIncidents',
  monthlyIncidents: 'safetyMonthlyIncidents',
  complianceCategories: 'safetyComplianceCategories',
  hazardTypes: 'safetyHazardTypes',
  drills: 'safetyDrills',
  inspections: 'safetyInspections',
};

async function getIncidents() {
  return getAll(COLLECTIONS.incidents);
}

async function getMonthlyIncidents() {
  return getAll(COLLECTIONS.monthlyIncidents);
}

async function getComplianceCategories() {
  return getAll(COLLECTIONS.complianceCategories);
}

async function getHazardTypes() {
  return getAll(COLLECTIONS.hazardTypes);
}

async function getDrills() {
  return getAll(COLLECTIONS.drills);
}

async function getInspections() {
  return getAll(COLLECTIONS.inspections);
}

async function seedSafetyData(data) {
  await batchSet(COLLECTIONS.incidents, data.incidents);
  await batchSet(COLLECTIONS.monthlyIncidents, data.monthlyIncidents);
  await batchSet(COLLECTIONS.complianceCategories, data.complianceCategories);
  await batchSet(COLLECTIONS.hazardTypes, data.hazardTypes);
  await batchSet(COLLECTIONS.drills, data.drills);
  await batchSet(COLLECTIONS.inspections, data.inspections);
}

module.exports = {
  COLLECTIONS,
  getIncidents,
  getMonthlyIncidents,
  getComplianceCategories,
  getHazardTypes,
  getDrills,
  getInspections,
  seedSafetyData,
};
