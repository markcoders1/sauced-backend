var admin = require("firebase-admin");

var serviceAccount = require("../sauced-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});