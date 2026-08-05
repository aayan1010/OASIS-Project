// services/finance.service.js

const { getAll, createDoc, updateDoc, deleteDoc, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  monthlyBudget: 'financeMonthlyBudget',
  opexBreakdown: 'financeOpexBreakdown',
  revenueStreams: 'financeRevenueStreams',
  costPerUnit: 'financeCostPerUnit',
  capexProjects: 'financeCapexProjects',
  monthlyRevenue: 'financeMonthlyRevenue',
};

async function getMonthlyBudget() {
  return getAll(COLLECTIONS.monthlyBudget);
}

async function getOpexBreakdown() {
  return getAll(COLLECTIONS.opexBreakdown);
}

async function getRevenueStreams() {
  return getAll(COLLECTIONS.revenueStreams);
}

async function getCostPerUnit() {
  return getAll(COLLECTIONS.costPerUnit);
}

async function getCapexProjects() {
  return getAll(COLLECTIONS.capexProjects);
}

async function getMonthlyRevenue() {
  return getAll(COLLECTIONS.monthlyRevenue);
}

async function createCapexProject(project) {
  return createDoc(COLLECTIONS.capexProjects, project);
}

async function updateCapexProject(id, updates) {
  return updateDoc(COLLECTIONS.capexProjects, id, updates);
}

async function deleteCapexProject(id) {
  return deleteDoc(COLLECTIONS.capexProjects, id);
}

async function seedFinanceData(data) {
  await batchSet(COLLECTIONS.monthlyBudget, data.monthlyBudget);
  await batchSet(COLLECTIONS.opexBreakdown, data.opexBreakdown);
  await batchSet(COLLECTIONS.revenueStreams, data.revenueStreams);
  await batchSet(COLLECTIONS.costPerUnit, data.costPerUnit);
  await batchSet(COLLECTIONS.capexProjects, data.capexProjects);
  await batchSet(COLLECTIONS.monthlyRevenue, data.monthlyRevenue);
}

module.exports = {
  COLLECTIONS,
  getMonthlyBudget,
  getOpexBreakdown,
  getRevenueStreams,
  getCostPerUnit,
  getCapexProjects,
  getMonthlyRevenue,
  createCapexProject,
  updateCapexProject,
  deleteCapexProject,
  seedFinanceData,
};
