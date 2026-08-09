// services/logistics.service.js

const { getAll, batchSet } = require('../firebase/firestore');

const COLLECTIONS = {
  inventory: 'logisticsInventory',
  shipments: 'logisticsShipments',
  warehouses: 'logisticsWarehouses',
  deliveryPerformance: 'logisticsDeliveryPerformance',
  supplyChainAlerts: 'logisticsSupplyChainAlerts',
};

async function getInventory() {
  return getAll(COLLECTIONS.inventory);
}

async function getShipments() {
  return getAll(COLLECTIONS.shipments);
}

async function getWarehouses() {
  return getAll(COLLECTIONS.warehouses);
}

async function getDeliveryPerformance() {
  return getAll(COLLECTIONS.deliveryPerformance);
}

async function getSupplyChainAlerts() {
  return getAll(COLLECTIONS.supplyChainAlerts);
}

async function seedLogisticsData(data) {
  await batchSet(COLLECTIONS.inventory, data.inventory);
  await batchSet(COLLECTIONS.shipments, data.shipments);
  await batchSet(COLLECTIONS.warehouses, data.warehouses);
  await batchSet(COLLECTIONS.deliveryPerformance, data.deliveryPerformance);
  await batchSet(COLLECTIONS.supplyChainAlerts, data.supplyChainAlerts);
}

module.exports = {
  COLLECTIONS,
  getInventory,
  getShipments,
  getWarehouses,
  getDeliveryPerformance,
  getSupplyChainAlerts,
  seedLogisticsData,
};
