// services/alerts.service.js

const { getAll, getById, getWhere, createDoc, updateDoc, deleteDoc } = require('../firebase/firestore');

const COLLECTION = 'alerts';

async function getAllAlerts() {
  return getAll(COLLECTION);
}

async function getAlertById(id) {
  return getById(COLLECTION, id);
}

async function getAlertsByStatus(status) {
  return getWhere(COLLECTION, 'status', '==', status);
}

async function getAlertsForAsset(assetId) {
  return getWhere(COLLECTION, 'assetId', '==', assetId);
}

async function createAlert(alert) {
  return createDoc(COLLECTION, alert);
}

async function acknowledgeAlert(id) {
  return updateDoc(COLLECTION, id, { status: 'acknowledged' });
}

async function resolveAlert(id) {
  return updateDoc(COLLECTION, id, { status: 'resolved' });
}

async function deleteAlert(id) {
  return deleteDoc(COLLECTION, id);
}

module.exports = {
  getAllAlerts,
  getAlertById,
  getAlertsByStatus,
  getAlertsForAsset,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert,
};