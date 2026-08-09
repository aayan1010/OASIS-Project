// routes/demo.routes.js

const express = require('express');
const router = express.Router();
const { generateRandomTelemetryBatch } = require('../services/telemetry.service');
const { generateRandomAlert } = require('../services/alerts.service');

router.post('/generate', async (req, res) => {
  try {
    const telemetry = await generateRandomTelemetryBatch(6);
    const alert = await generateRandomAlert();
    res.status(201).json({ success: true, telemetry, alert });
  } catch (err) {
    console.error('POST /api/demo/generate failed:', err);
    res.status(500).json({ error: 'Failed to generate demo data' });
  }
});

module.exports = router;
