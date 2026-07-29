// firebase/admin.js


const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
        'Missing Firebase credentials. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, ' +
        'and FIREBASE_PRIVATE_KEY are set in oasis_backend/.env'
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    getFirebaseAdminApp();
    dbInstance = getFirestore();
  }
  return dbInstance;
}

module.exports = { getDb };