// routes/drills.routes.js

const express = require('express');
const router = express.Router();
const { getDrills, createDrill } = require('../services/safety.service');

router.get('/', async (req, res) => {
  try {
    const drills = await getDrills();
    res.json(drills);
  } catch (err) {
    console.error('GET /api/drills failed:', err);
    res.status(500).json({ error: 'Failed to fetch drills' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, date, site } = req.body;
    if (!type || !date || !site) {
      return res.status(400).json({ error: 'type, date, and site are required' });
    }
    const drill = await createDrill(req.body);
    res.status(201).json(drill);
  } catch (err) {
    console.error('POST /api/drills failed:', err);
    res.status(500).json({ error: 'Failed to schedule drill' });
  }
});

module.exports = router;
