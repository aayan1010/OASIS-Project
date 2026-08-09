// routes/production.routes.js

const express = require('express');
const router = express.Router();
const {
  getScheduleAdherence,
  getHourlyProduction,
  getDailyYield,
  getDowntimeEvents,
  getRawRecords,
  createRawRecord,
} = require('../services/production.service');

router.get('/schedule-adherence', async (req, res) => {
  try {
    res.json(await getScheduleAdherence());
  } catch (err) {
    console.error('GET /api/production/schedule-adherence failed:', err);
    res.status(500).json({ error: 'Failed to fetch schedule adherence data' });
  }
});

router.get('/hourly', async (req, res) => {
  try {
    res.json(await getHourlyProduction());
  } catch (err) {
    console.error('GET /api/production/hourly failed:', err);
    res.status(500).json({ error: 'Failed to fetch hourly production data' });
  }
});

router.get('/daily-yield', async (req, res) => {
  try {
    res.json(await getDailyYield());
  } catch (err) {
    console.error('GET /api/production/daily-yield failed:', err);
    res.status(500).json({ error: 'Failed to fetch daily yield data' });
  }
});

router.get('/downtime', async (req, res) => {
  try {
    res.json(await getDowntimeEvents());
  } catch (err) {
    console.error('GET /api/production/downtime failed:', err);
    res.status(500).json({ error: 'Failed to fetch downtime events' });
  }
});

router.get('/records', async (req, res) => {
  try {
    res.json(await getRawRecords());
  } catch (err) {
    console.error('GET /api/production/records failed:', err);
    res.status(500).json({ error: 'Failed to fetch production records' });
  }
});

// POST /api/production/records — log a new daily production output entry.
router.post('/records', async (req, res) => {
  try {
    const { site_id, date, actual_production, production_target } = req.body;
    if (!site_id || !date || actual_production == null || production_target == null) {
      return res.status(400).json({
        error: 'site_id, date, actual_production, and production_target are required',
      });
    }
    const record = await createRawRecord(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error('POST /api/production/records failed:', err);
    res.status(500).json({ error: 'Failed to log production record' });
  }
});

module.exports = router;
