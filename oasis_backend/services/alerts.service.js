// services/alerts.service.js
// generateRandomAlert is the new piece — creates one random alert matching
// the real AlertRecord shape (lowercase severity/status, matching what
// acknowledgeAlert/resolveAlert already write).

const { getAll, getById, getWhere, createDoc, updateDoc, deleteDoc } = require('../firebase/firestore');

const COLLECTION = 'alerts';

const DEMO_ASSETS = [
  'AST-0001', 'AST-0023', 'AST-0054', 'AST-0080',
  'AST-0107', 'AST-0132', 'AST-0145', 'AST-0092',
];

const ALERT_TYPES = ['High Temperature', 'Excess Vibration'];
const SEVERITIES = ['high', 'medium', 'low'];

const DESCRIPTIONS = {
  'High Temperature': [
    'Sustained high temperature detected during operation',
    'Temperature reading exceeded safe operating threshold',
    'Thermal sensor flagged abnormal heat buildup',
  ],
  'Excess Vibration': [
    'Sustained high-frequency vibration detected',
    'Abnormal vibration pattern detected, possible bearing wear',
    'Vibration levels exceeded normal operating threshold',
  ],
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nowAsTimestampString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

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

async function generateRandomAlert() {
  const assetId = randomFrom(DEMO_ASSETS);
  const alertType = randomFrom(ALERT_TYPES);
  const severity = randomFrom(SEVERITIES);
  const description = randomFrom(DESCRIPTIONS[alertType]);

  const alert = {
    assetId,
    timestamp: nowAsTimestampString(),
    alertType,
    severity,
    description,
    status: 'active',
  };

  return createDoc(COLLECTION, alert);
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
  generateRandomAlert,
};
