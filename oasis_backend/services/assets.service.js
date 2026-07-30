// services/assets.service.js

const { getAll, getById, getWhere, createDoc, updateDoc, deleteDoc } = require('../firebase/firestore');

const COLLECTION = 'assets';

async function getAllAssets() {
  return getAll(COLLECTION);
}

async function getAssetById(id) {
  return getById(COLLECTION, id);
}

async function getAssetsByStatus(status) {
  return getWhere(COLLECTION, 'status', '==', status);
}

async function createAsset(asset) {
  return createDoc(COLLECTION, asset);
}

async function updateAsset(id, updates) {
  return updateDoc(COLLECTION, id, updates);
}

async function deleteAsset(id) {
  return deleteDoc(COLLECTION, id);
}

module.exports = { getAllAssets, getAssetById, getAssetsByStatus, createAsset, updateAsset, deleteAsset };