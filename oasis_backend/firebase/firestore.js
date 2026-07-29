// firebase/firestore.js


const { getDb } = require('./admin');

async function getAll(collection) {
  const snap = await getDb().collection(collection).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getById(collection, id) {
  const doc = await getDb().collection(collection).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getWhere(collection, field, op, value) {
  const snap = await getDb().collection(collection).where(field, op, value).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createDoc(collection, data) {
  const db = getDb();
  if (data.id) {
    await db.collection(collection).doc(data.id).set(data);
    return data;
  }
  const ref = await db.collection(collection).add(data);
  return { ...data, id: ref.id };
}

async function updateDoc(collection, id, data) {
  await getDb().collection(collection).doc(id).set(data, { merge: true });
}

async function deleteDoc(collection, id) {
  await getDb().collection(collection).doc(id).delete();
}

async function batchSet(collection, items) {
  const db = getDb();
  const chunks = [];
  for (let i = 0; i < items.length; i += 500) {
    chunks.push(items.slice(i, i + 500));
  }
  for (const chunk of chunks) {
    const batch = db.batch();
    for (const item of chunk) {
      batch.set(db.collection(collection).doc(item.id), item);
    }
    await batch.commit();
  }
}

module.exports = { getAll, getById, getWhere, createDoc, updateDoc, deleteDoc, batchSet };