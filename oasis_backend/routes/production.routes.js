// routes/production.routes.js

const express = require('express');
const router = express.Router();
const { getScheduleAdherence } = require('../services/production.service');

router.get('/schedule-adherence', async (req, res) => {
  try {
    res.json(await getScheduleAdherence());
  } catch (err) {
    console.error('GET /api/production/schedule-adherence failed:', err);
    res.status(500).json({ error: 'Failed to fetch schedule adherence data' });
  }
});

module.exports = router;