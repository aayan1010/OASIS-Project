// routes/incidents.routes.js

const express = require('express');
const router = express.Router();
const {
  getReportedIncidents,
  createReportedIncident,
} = require('../services/safety.service');

router.get('/', async (req, res) => {
  try {
    const incidents = await getReportedIncidents();
    res.json(incidents);
  } catch (err) {
    console.error('GET /api/incidents failed:', err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'description is required' });
    }
    const incident = await createReportedIncident(req.body);
    res.status(201).json(incident);
  } catch (err) {
    console.error('POST /api/incidents failed:', err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

module.exports = router;
