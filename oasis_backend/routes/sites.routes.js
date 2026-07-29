// routes/sites.routes.js

const express = require('express');
const router = express.Router();
const { getAllSites, createSite } = require('../services/sites.service');

router.get('/', async (req, res) => {
  try {
    const sites = await getAllSites();
    res.json(sites);
  } catch (err) {
    console.error('GET /api/sites failed:', err);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
    const site = await createSite(req.body);
    res.status(201).json(site);
  } catch (err) {
    console.error('POST /api/sites failed:', err);
    res.status(500).json({ error: 'Failed to create site' });
  }
});

module.exports = router;