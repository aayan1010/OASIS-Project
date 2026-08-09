// services/plans.service.js
// Handles production plan CRUD against the `productionPlans` Firestore collection.

const { getAll, createDoc } = require('../firebase/firestore');

const COLLECTION = 'productionPlans';

async function getPlans() {
  const plans = await getAll(COLLECTION);
  // Return newest first so the latest plan is always index 0.
  return plans.sort((a, b) =>
    String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
  );
}

async function createPlan(plan) {
  const now = new Date().toISOString();
  const record = {
    ...plan,
    createdAt: now,
    updatedAt: now,
  };
  return createDoc(COLLECTION, record);
}

module.exports = { getPlans, createPlan };
