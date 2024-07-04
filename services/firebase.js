const admin = require("firebase-admin");
var serviceAccount = require("../sauced-firebase.json");
let initialized = false;
function initializeAdmin() {
  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    initialized = true;
  }
  return admin;
}
module.exports = {
  initializeAdmin,
};