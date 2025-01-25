const pool = require("../Configs/Database");

//.....................................................
//Saving FCM Token To DB...............................
//.....................................................

exports.saveFCMToken = async (req, res) => {
  const { token, cust_no } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      const savetoken = `INSERT INTO fcmTokens (dairy_id, center_id, cust_no, token) VALUES (?, ?, ?, ?)`;

      connection.query(
        savetoken,
        [dairy_id, center_id, cust_no, token],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(201).json({
            message: "FCM Token saved successfully!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error:", error);
      return res.status(400).json({ message: error.message });
    }
  });
};

//.....................................................
//Retrive FCM Token ...................................
//.....................................................

exports.getFCMToken = async (req, res) => {
  const { cust_no } = req.body;
  if (!cust_no) {
    return res.status(400).json({ message: "Customer number is required" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      const tokenquery = `SELECT token FROM fcmtokens WHERE dairy_id = ? AND center_id = ? AND cust_no = ?`;

      connection.query(
        tokenquery,
        [dairy_id, center_id, cust_no],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(200).json({ message: "FCM token not found" });
          }
          // Extract token from result
          const fcmToken = result[0].token;

          res.status(200).json({
            fcm_token: fcmToken,
            message: "FCM Token fetched successfully",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error:", error);
      return res.status(400).json({ message: error.message });
    }
  });
};

//.....................................................
//Check Existing FCM Token.............................
//.....................................................

exports.checkFCMToken = async (req, res) => {
  const { cust_no } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      const query = `SELECT token FROM fcmTokens WHERE dairy_id = ? AND center_id = ? AND cust_no = ?`;

      connection.query(query, [dairy_id, center_id, cust_no], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        // Check if the result is empty
        const tokenExists = result.length > 0;

        // Return true if token exists, otherwise false
        res.status(200).json({
          tokenExists: tokenExists,
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error:", error);
      return res.status(400).json({ message: error.message });
    }
  });
};

// exports.saveNotification = async (req, res) => {
//   const { cust_no , title , fat , snf , rate , amt } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       const query = `SELECT fcmtoken FROM fcmTokens WHERE dairy_id = ? AND center_id = ? AND cust_no = ?`;
//
//       connection.query(query, [dairy_id, center_id, cust_no], (err, result) => {
//         connection.release();
//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Query execution error" });
//         }
//
//         if (result.length === 0) {
//           return res.status(404).json({ message: "FCM token not found" });
//         }
//
//         // Extract token from result
//         const fcmToken = result[0].fcmtoken;
//
//         res.status(200).json({
//           fcm_token: fcmToken,
//           message: "FCM Token fetched successfully",
//         });
//       });
//     } catch (error) {
//       connection.release(); // Ensure the connection is released on error
//       console.error("Error:", error);
//       return res.status(400).json({ message: error.message });
//     }
//   });
// };

//.....................................................
//Retrive Notification ................................
//.....................................................

// exports.getNotifications = async (req, res) => {
//   const { cust_no } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       const query = `SELECT fcmtoken FROM fcmTokens WHERE dairy_id = ? AND center_id = ? AND cust_no = ?`;
//
//       connection.query(query, [dairy_id, center_id, cust_no], (err, result) => {
//         connection.release();
//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Query execution error" });
//         }
//
//         if (result.length === 0) {
//           return res.status(404).json({ message: "FCM token not found" });
//         }
//
//         // Extract token from result
//         const fcmToken = result[0].fcmtoken;
//
//         res.status(200).json({
//           fcm_token: fcmToken,
//           message: "FCM Token fetched successfully",
//         });
//       });
//     } catch (error) {
//       connection.release(); // Ensure the connection is released on error
//       console.error("Error:", error);
//       return res.status(400).json({ message: error.message });
//     }
//   });
// };
