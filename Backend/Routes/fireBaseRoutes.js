const express = require("express");
const router = express.Router();
const verifyToken = require("../Middlewares/VerifyToken");
const sendNotification = require("../Controllers/FirebaseNotiController");
const {
  getFCMToken,
  saveFCMToken,
  checkFCMToken,
} = require("../Controllers/NotificationController");

router.route("/send/notification").post(verifyToken, sendNotification);
router.route("/get/fcm/token").post(verifyToken, getFCMToken);
router.route("/save/fcm/token").post(verifyToken, saveFCMToken);
router.route("/check/fcm/token").post(verifyToken, checkFCMToken);

module.exports = router;
