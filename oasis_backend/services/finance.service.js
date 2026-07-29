// services/finance.service.js

const { getAll, createDoc, updateDoc, deleteDoc, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  monthlyBudget: 'financeMonthlyBudget',
  opexBreakdown: 'financeOpexBreakdown',
  revenueStreams: 'financeRevenueStreams',
  costPerUnit: 'financeCostPerUnit',
  capexProjects: 'financeCapexProjects',
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
}

module.exports = {
  COLLECTIONS,
  getMonthlyBudget,
  getOpexBreakdown,
  getRevenueStreams,
  getCostPerUnit,
  getCapexProjects,
  createCapexProject,
  updateCapexProject,
  deleteCapexProject,
  seedFinanceData,
};