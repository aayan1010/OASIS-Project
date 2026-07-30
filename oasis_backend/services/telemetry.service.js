// services/telemetry.service.js

const { getAll, getWhere, createDoc, updateDoc } = require('../firebase/firestore');

const COLLECTION = 'telemetry';

async function getAllTelemetry() {
  return getAll(COLLECTION);
}

async function getTelemetryForAsset(assetId) {
  return getWhere(COLLECTION, 'assetId', '==', assetId);
}

async function upsertTelemetryReading(reading) {
  return createDoc(COLLECTION, reading);
}

async function updateTelemetryValue(id, updates) {
  return updateDoc(COLLECTION, id, updates);
}

module.exports = { getAllTelemetry, getTelemetryForAsset, upsertTelemetryReading, updateTelemetryValue };