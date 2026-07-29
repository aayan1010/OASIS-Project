// services/maintenance.service.js

const { getAll, getById, getWhere, createDoc, updateDoc, deleteDoc } = require('../firebase/firestore');

const COLLECTION = 'workOrders';

async function getAllWorkOrders() {
  return getAll(COLLECTION);
}

async function getWorkOrderById(id) {
  return getById(COLLECTION, id);
}

async function getWorkOrdersByStatus(status) {
  return getWhere(COLLECTION, 'status', '==', status);
}

async function createWorkOrder(order) {
  return createDoc(COLLECTION, order);
}

async function updateWorkOrder(id, updates) {
  return updateDoc(COLLECTION, id, updates);
}

async function closeWorkOrder(id) {
  return updateDoc(COLLECTION, id, {
    status: 'closed',
    closedAt: new Date().toISOString(),
  });
}

async function deleteWorkOrder(id) {
  return deleteDoc(COLLECTION, id);
}

module.exports = {
  getAllWorkOrders,
  getWorkOrderById,
  getWorkOrdersByStatus,
  createWorkOrder,
  updateWorkOrder,
  closeWorkOrder,
  deleteWorkOrder,
};