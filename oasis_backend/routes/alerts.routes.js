// routes/alerts.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  getAlertsByStatus,
  createAlert,
  acknowledgeAlert,
  resolveAlert,
} = require('../services/alerts.service');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const alerts = status ? await getAlertsByStatus(status) : await getAllAlerts();
    res.json(alerts);
  } catch (err) {
    console.error('GET /api/alerts failed:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, assetId } = req.body;
    if (!id || !assetId) return res.status(400).json({ error: 'id and assetId are required' });
    const alert = await createAlert(req.body);
    res.status(201).json(alert);
  } catch (err) {
    console.error('POST /api/alerts failed:', err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

router.post('/:id/acknowledge', async (req, res) => {
  try {
    await acknowledgeAlert(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(`POST /api/alerts/${req.params.id}/acknowledge failed:`, err);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

router.post('/:id/resolve', async (req, res) => {
  try {
    await resolveAlert(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(`POST /api/alerts/${req.params.id}/resolve failed:`, err);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

module.exports = router;