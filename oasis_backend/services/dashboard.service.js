// services/dashboard.service.js

const { getAll, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  navigation: 'dashboardNavigation',
  kpis: 'dashboardKpis',
  quickActions: 'dashboardQuickActions',
  sectorOverview: 'dashboardSectorOverview',
};

async function getNavigation() {
  return getAll(COLLECTIONS.navigation);
}

async function getKpis() {
  return getAll(COLLECTIONS.kpis);
}

async function getQuickActions() {
  return getAll(COLLECTIONS.quickActions);
}

async function getSectorOverview() {
  return getAll(COLLECTIONS.sectorOverview);
}

async function seedDashboardData(data) {
  await batchSet(COLLECTIONS.navigation, data.navigation);
  await batchSet(COLLECTIONS.kpis, data.kpis);
  await batchSet(COLLECTIONS.quickActions, data.quickActions);
  await batchSet(COLLECTIONS.sectorOverview, data.sectorOverview);
}

module.exports = {
  COLLECTIONS,
  getNavigation,
  getKpis,
  getQuickActions,
  getSectorOverview,
  seedDashboardData,
};
