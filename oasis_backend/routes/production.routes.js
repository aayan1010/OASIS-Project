// routes/production.routes.js

const express = require('express');
const router = express.Router();
const {
  getScheduleAdherence,
  getHourlyProduction,
  getDailyYield,
  getDowntimeEvents,
  getRawRecords,
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

module.exports = router;
