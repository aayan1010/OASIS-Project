// services/telemetry.service.js
// generateRandomTelemetryBatch is the new piece — writes a batch of random
// telemetry docs matching the TelemetrySensor shape the frontend expects.

const { getAll, getWhere, createDoc, updateDoc } = require('../firebase/firestore');

const COLLECTION = 'telemetry';

// small pool of known assets to attach random readings to
const DEMO_ASSETS = [
  { assetId: 'AST-0001', assetName: 'Generator-001' },
  { assetId: 'AST-0023', assetName: 'Compressor-023' },
  { assetId: 'AST-0054', assetName: 'Generator-054' },
  { assetId: 'AST-0080', assetName: 'Storage Tank-080' },
  { assetId: 'AST-0107', assetName: 'Valve-107' },
  { assetId: 'AST-0132', assetName: 'Pump-132' },
  { assetId: 'AST-0145', assetName: 'Compressor-145' },
];

const SENSOR_DEFS = [
  { name: 'Temperature', type: 'Temperature', unit: '°C', min: 40, max: 70, warnAt: 55, critAt: 62 },
  { name: 'Pressure', type: 'Pressure', unit: 'PSI', min: 20, max: 60, warnAt: null, critAt: null },
  { name: 'Vibration', type: 'Vibration', unit: 'mm/s', min: 0.3, max: 1.6, warnAt: 0.8, critAt: 1.2 },
  { name: 'Flow Rate', type: 'Flow Rate', unit: 'bbl/h', min: 50, max: 300, warnAt: null, critAt: null },
  { name: 'Power', type: 'Power', unit: 'kW', min: 100, max: 900, warnAt: null, critAt: null },
  { name: 'Oil Level', type: 'Oil Level', unit: '%', min: 70, max: 100, warnAt: null, critAt: null },
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max, decimals = 1) {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function statusFor(sensorDef, value) {
  if (sensorDef.critAt !== null && value >= sensorDef.critAt) return 'critical';
  if (sensorDef.warnAt !== null && value >= sensorDef.warnAt) return 'warning';
  return 'normal';
}

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

async function generateRandomTelemetryBatch(count = 6) {
  const created = [];

  for (let i = 0; i < count; i++) {
    const asset = randomFrom(DEMO_ASSETS);
    const sensorDef = randomFrom(SENSOR_DEFS);
    const value = randomBetween(sensorDef.min, sensorDef.max, sensorDef.unit === 'Power' ? 0 : 1);
    const status = statusFor(sensorDef, value);
    const trend = randomFrom(['up', 'down', 'stable']);
    const trendPct = `${trend === 'down' ? '-' : trend === 'up' ? '+' : ''}${randomBetween(0, 5, 1)}%`;

    const doc = {
      id: `tel-demo-${Date.now()}-${i}`,
      assetId: asset.assetId,
      assetName: asset.assetName,
      sensorName: sensorDef.name,
      sensorType: sensorDef.type,
      value: value.toFixed(sensorDef.unit === 'Power' ? 0 : sensorDef.unit === '°C' ? 1 : sensorDef.unit === 'mm/s' ? 2 : 1),
      unit: sensorDef.unit,
      trend,
      trendPct,
      sector: 'oil',
      status,
      lastUpdate: 'Just now',
    };

    const result = await createDoc(COLLECTION, doc);
    created.push(result);
  }

  return created;
}

module.exports = {
  getAllTelemetry,
  getTelemetryForAsset,
  upsertTelemetryReading,
  updateTelemetryValue,
  generateRandomTelemetryBatch,
};
