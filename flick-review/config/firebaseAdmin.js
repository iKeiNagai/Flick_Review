// firebaseAdmin.js
const admin = require("firebase-admin");

// Path to your service account key file
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
