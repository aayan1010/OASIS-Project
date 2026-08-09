// services/safety.service.js

const { getAll, createDoc, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  incidents: 'safetyIncidents',
  monthlyIncidents: 'safetyMonthlyIncidents',
  complianceCategories: 'safetyComplianceCategories',
  hazardTypes: 'safetyHazardTypes',
  drills: 'safetyDrills',
  inspections: 'safetyInspections',
  // User-reported incidents (via the Report Incident modal) live in their own
  // collection, separate from the seeded `safetyIncidents` reference data.
  reportedIncidents: 'incidents',
};

async function getIncidents() {
  return getAll(COLLECTIONS.incidents);
}

async function getReportedIncidents() {
  const incidents = await getAll(COLLECTIONS.reportedIncidents);
  // Newest first.
  return incidents.sort((a, b) =>
    String(b.dateLogged ?? '').localeCompare(String(a.dateLogged ?? '')),
  );
}

async function createReportedIncident(incident) {
  const now = new Date().toISOString();
  const record = {
    ...incident,
    status: incident.status ?? 'open',
    dateLogged: incident.dateLogged ?? now,
    createdAt: now,
  };
  return createDoc(COLLECTIONS.reportedIncidents, record);
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
  getReportedIncidents,
  createReportedIncident,
  getMonthlyIncidents,
  getComplianceCategories,
  getHazardTypes,
  getDrills,
  getInspections,
  seedSafetyData,
};
