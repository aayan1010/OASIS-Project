// routes/plans.routes.js

const express = require('express');
const router = express.Router();
const { getPlans, createPlan } = require('../services/plans.service');

// GET /api/plans — return all saved production plans, newest first.
router.get('/', async (req, res) => {
  try {
    const plans = await getPlans();
    res.json(plans);
  } catch (err) {
    console.error('GET /api/plans failed:', err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// POST /api/plans — persist a new (or updated) production plan.
router.post('/', async (req, res) => {
  try {
    const { siteId, targetOutput, targetEfficiency, effectiveFrom, effectiveTo } = req.body;
    if (!siteId || !targetOutput || !targetEfficiency || !effectiveFrom || !effectiveTo) {
      return res.status(400).json({ error: 'siteId, targetOutput, targetEfficiency, effectiveFrom, and effectiveTo are required' });
    }
    const plan = await createPlan(req.body);
    res.status(201).json(plan);
  } catch (err) {
    console.error('POST /api/plans failed:', err);
    res.status(500).json({ error: 'Failed to save plan' });
  }
});

module.exports = router;
