// const admin = require("../utils/firebaseAdmin");
// 
// class NotificationService {
//   static async sendNotification(deviceToken, title, body) {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token: deviceToken,
//     };
//     try {
//       const response = await admin.messaging().send(message);
//       return response;
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       throw new Error("Failed to send notification.");
//     }
//   }
// }
// 
// module.exports = NotificationService;

const admin = require("../utils/firebaseAdmin");
// const admin = require("firebase-admin");

class NotificationService {
  static async sendNotification(deviceToken, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };
    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification.");
    }
  }
}

module.exports = NotificationService;
