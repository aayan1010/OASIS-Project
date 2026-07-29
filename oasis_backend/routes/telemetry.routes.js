// routes/telemetry.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllTelemetry,
  getTelemetryForAsset,
  upsertTelemetryReading,
} = require('../services/telemetry.service');

router.get('/', async (req, res) => {
  try {
    const readings = await getAllTelemetry();
    res.json(readings);
  } catch (err) {
    console.error('GET /api/telemetry failed:', err);
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
});

router.get('/:assetId', async (req, res) => {
  try {
    const readings = await getTelemetryForAsset(req.params.assetId);
    res.json(readings);
  } catch (err) {
    console.error(`GET /api/telemetry/${req.params.assetId} failed:`, err);
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, assetId } = req.body;
    if (!id || !assetId) return res.status(400).json({ error: 'id and assetId are required' });
    const saved = await upsertTelemetryReading(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/telemetry failed:', err);
    res.status(500).json({ error: 'Failed to save telemetry reading' });
  }
});

module.exports = router;