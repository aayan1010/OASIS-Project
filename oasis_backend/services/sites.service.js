// services/sites.service.js

const { getAll, getById, createDoc, updateDoc, deleteDoc } = require('../firebase/firestore');

const COLLECTION = 'sites';

async function getAllSites() {
  return getAll(COLLECTION);
}

async function getSiteById(id) {
  return getById(COLLECTION, id);
}

async function createSite(site) {
  return createDoc(COLLECTION, site);
}

async function updateSite(id, updates) {
  return updateDoc(COLLECTION, id, updates);
}

async function deleteSite(id) {
  return deleteDoc(COLLECTION, id);
}

module.exports = { getAllSites, getSiteById, createSite, updateSite, deleteSite };