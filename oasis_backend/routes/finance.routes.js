// routes/finance.routes.js

const express = require('express');
const router = express.Router();
const {
  getMonthlyBudget,
  getOpexBreakdown,
  getRevenueStreams,
  getCostPerUnit,
  getCapexProjects,
  createCapexProject,
} = require('../services/finance.service');

router.get('/budget', async (req, res) => {
  try {
    res.json(await getMonthlyBudget());
  } catch (err) {
    console.error('GET /api/finance/budget failed:', err);
    res.status(500).json({ error: 'Failed to fetch budget data' });
  }
});

router.get('/opex', async (req, res) => {
  try {
    res.json(await getOpexBreakdown());
  } catch (err) {
    console.error('GET /api/finance/opex failed:', err);
    res.status(500).json({ error: 'Failed to fetch opex data' });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    res.json(await getRevenueStreams());
  } catch (err) {
    console.error('GET /api/finance/revenue failed:', err);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

router.get('/cost-per-unit', async (req, res) => {
  try {
    res.json(await getCostPerUnit());
  } catch (err) {
    console.error('GET /api/finance/cost-per-unit failed:', err);
    res.status(500).json({ error: 'Failed to fetch cost-per-unit data' });
  }
});

router.get('/capex', async (req, res) => {
  try {
    res.json(await getCapexProjects());
  } catch (err) {
    console.error('GET /api/finance/capex failed:', err);
    res.status(500).json({ error: 'Failed to fetch CAPEX projects' });
  }
});

router.post('/capex', async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
    const project = await createCapexProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error('POST /api/finance/capex failed:', err);
    res.status(500).json({ error: 'Failed to create CAPEX project' });
  }
});

module.exports = router;