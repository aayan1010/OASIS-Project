// routes/maintenance.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllWorkOrders,
  getWorkOrdersByStatus,
  createWorkOrder,
  updateWorkOrder,
  closeWorkOrder,
} = require('../services/maintenance.service');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const orders = status ? await getWorkOrdersByStatus(status) : await getAllWorkOrders();
    res.json(orders);
  } catch (err) {
    console.error('GET /api/maintenance failed:', err);
    res.status(500).json({ error: 'Failed to fetch work orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'id and title are required' });
    const order = await createWorkOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error('POST /api/maintenance failed:', err);
    res.status(500).json({ error: 'Failed to create work order' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (req.body.status === 'closed') {
      await closeWorkOrder(req.params.id);
    } else {
      await updateWorkOrder(req.params.id, req.body);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(`PATCH /api/maintenance/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to update work order' });
  }
});

module.exports = router;