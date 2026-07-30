// routes/assets.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllAssets,
  getAssetById,
  getAssetsByStatus,
  createAsset,
  updateAsset,
  deleteAsset,
} = require('../services/assets.service');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const assets = status ? await getAssetsByStatus(status) : await getAllAssets();
    res.json(assets);
  } catch (err) {
    console.error('GET /api/assets failed:', err);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

router.get('/:id', async (req, res) => {
  const asset = await getAssetById(req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json(asset);
});

router.post('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
    const asset = await createAsset(req.body);
    res.status(201).json(asset);
  } catch (err) {
    console.error('POST /api/assets failed:', err);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    await updateAsset(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(`PATCH /api/assets/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteAsset(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/assets/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

module.exports = router;