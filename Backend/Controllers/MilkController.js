const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// ..................................................
// Milk Collection .....................
// ..................................................

// Check Username ................

//old
exports.custDetails = async (req, res) => {
  const { user_code } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      const getCustname = `SELECT cid, cname, rateChartNo, ratecharttype, rcdate FROM customer WHERE srno = ? AND orgid = ?, center_id = ?`;

      connection.query(
        getCustname,
        [user_code, dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Check if result is empty (no customer found)
          if (result.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
          }

          // Proceed if customer details are found
          const custdetails = result[0];
          res.status(200).json({ custdetails });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// exports.maxDMEID = async (req, res) =>{
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const maxRateChartNoQuery = `SELECT MAX(rccode) as maxRcCode FROM ratemaster WHERE companyid = ? AND center_id = ?`;
//
//       connection.query(
//         maxRateChartNoQuery,
//         [dairy_id, center_id],
//         (err, result) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//           const maxRcCode = result[0]?.maxRcCode
//             ? Math.max(result[0].maxRcCode + 1, 1)
//             : 1;
//
//           res.status(200).json({
//             maxRcCode: maxRcCode,
//           });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       return res.status(400).json({ message: error.message });
//     }
//   });
// }

// saving milk collection to database

//.........................................................
// Save Milk Collection Settings ..........................
//.........................................................

exports.saveMilkCollSetting = async (req, res) => {
  const {
    milkType,
    prevFat,
    prevSnf,
    prevDeg,
    manLiters,
    manFat,
    manSnf,
    manDeg,
    sms,
    print,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    if (!dairy_id || !center_id) {
      connection.release();
      return res
        .status(400)
        .json({ message: "Dairy ID or Center ID not found!" });
    }

    const saveMilkCollSettingQuery = `
      INSERT INTO collectionsettings 
        (dairy_id, center_id, milkType, prevFat, prevSnf, prevDeg, manLiters, manFat, manSnf, manDeg, sms, print) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      saveMilkCollSettingQuery,
      [
        dairy_id,
        center_id,
        milkType,
        prevFat,
        prevSnf,
        prevDeg,
        manLiters,
        manFat,
        manSnf,
        manDeg,
        sms,
        print,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        res
          .status(200)
          .json({ message: "Milk Collection Settings Saved Successfully!" });
      }
    );
  });
};

//.........................................................
// Update Milk Collection Settings ........................
//.........................................................

exports.updateMilkCollSetting = async (req, res) => {
  const {
    milkType,
    prevFat,
    prevSnf,
    prevDeg,
    manLiters,
    manFat,
    manSnf,
    manDeg,
    sms,
    print,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    if (!dairy_id || !center_id) {
      connection.release();
      return res
        .status(400)
        .json({ message: "Dairy ID or Center ID not found!" });
    }

    const updateMilkCollSettingQuery = `
      UPDATE collectionsettings 
      SET milkType = ?, prevFat = ?, prevSnf = ?, prevDeg = ?, manLiters = ?, manFat = ?, manSnf = ?, manDeg = ?, sms = ?, print = ?
      WHERE dairy_id = ? AND center_id = ?
    `;

    connection.query(
      updateMilkCollSettingQuery,
      [
        milkType,
        prevFat,
        prevSnf,
        prevDeg,
        manLiters,
        manFat,
        manSnf,
        manDeg,
        sms,
        print,
        dairy_id,
        center_id,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        res
          .status(200)
          .json({ message: "Milk Collection Settings Updated Successfully!" });
      }
    );
  });
};

//.........................................................
// Save Milk Collection (slot wise entry)...................................
//.........................................................

// exports.milkCollection = async (req, res) => {
//    const milkColl = req.body.entries;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_role = req.user.user_role;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       // Prepare the SQL query
//       const milkcollection = `
//         INSERT INTO ${dairy_table}
//         (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//
//       // Execute the query
//       connection.query(
//         milkcollection,
//         [
//           dairy_id,
//           user_role,
//           ReceiptDate,
//           time,
//           animal,
//           liter,
//           fat,
//           snf,
//           amt,
//           "28",
//           acccode,
//           degree,
//           rate,
//           cname,
//           rno,
//           center_id,
//         ],
//         (err, results) => {
//           connection.release();
//
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           res.status(200).json({ message: "Milk entry saved successfully!" });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

exports.milkCollection = async (req, res) => {
  const { milkColl } = req.body;

  const dairy_id = req.user.dairy_id;
  const user_role = req.user.user_role;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  if (!Array.isArray(milkColl) || milkColl.length === 0) {
    return res
      .status(400)
      .json({ message: "Entries should be a non-empty array" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  // SQL query for bulk inserting entries
  const milkCollectionQuery = `
    INSERT INTO ${dairy_table} 
    (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id) 
    VALUES ?
  `;

  // Prepare the values array for bulk insertion
  const values = milkColl.map((entry) => {
    const {
      date,
      code,
      time,
      animal,
      liters,
      fat,
      snf,
      amt,
      degree,
      rate,
      cname,
      acccode,
    } = entry;

    // Validate fields are present and have correct types; handle rounding if needed
    if (
      !date ||
      !time ||
      !animal ||
      liters == null ||
      fat == null ||
      snf == null ||
      amt == null ||
      degree == null ||
      rate == null ||
      !cname ||
      !code ||
      !acccode
    ) {
      throw new Error("Each milk entry must have all required fields.");
    }

    return [
      dairy_id,
      user_role,
      date,
      time,
      animal,
      parseFloat(liters).toFixed(2),
      parseFloat(fat).toFixed(1),
      parseFloat(snf).toFixed(1),
      parseFloat(amt).toFixed(2),
      "28",
      acccode,
      parseFloat(degree).toFixed(1),
      parseFloat(rate).toFixed(2),
      cname,
      code,
      center_id,
    ];
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ message: "Transaction error" });
      }

      // Execute bulk insert query with values
      connection.query(milkCollectionQuery, [values], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error executing query: ", err);
            res.status(500).json({ message: "Error saving milk entries" });
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ message: "Transaction commit error" });
            });
          }

          connection.release();
          res.status(200).json({
            message: "All milk entries saved successfully!",
            insertedRecords: results.affectedRows,
          });
        });
      });
    });
  });
};

//.........................................................
// Save Milk Collection (single entry)...................................
//.........................................................

exports.milkCollectionOneEntry = async (req, res) => {
  const {
    date,
    code,
    time,
    animal,
    liters,
    fat,
    snf,
    amt,
    degree,
    rate,
    cname,
    acccode,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          date,
          time,
          animal,
          liters,
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          cname,
          code,
          center_id,
        ],
        (err, results) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// Save Previous Milk Collection ..........................
//.........................................................

//get rate from rate chart and calculate amount....................................................................

exports.getRateAmount = (req, res) => {
  const { rccode, rcdate, fat, snf, time, animal, liters } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    if (!dairy_id) {
      connection.release();
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    const getRateAmt = `
    SELECT rate FROM mysql_4234_inventory11.ratemaster WHERE companyid = ? AND center_id = ? AND rcdate <= ? AND fat = ? AND snf = ? AND ME = ? AND CB = ? ORDER BY rcdate DESC LIMIT 1
  `;
    // in query
    // rcdate is lessthan or equal to ratechartdate

    connection.query(
      getRateAmt,
      [dairy_id, center_id, rccode, rcdate, fat, snf, time, animal],
      (err, results) => {
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Rate not found for the provided parameters." });
        }

        const rate = results[0].rate;

        // Ensure 'liters' is a number
        const litersNumber = parseFloat(liters);
        if (isNaN(litersNumber)) {
          return res.status(400).json({ message: "Invalid value for liters." });
        }

        const amt = litersNumber * parseFloat(rate);

        res.status(200).json({ rate: parseFloat(rate), amt });
      }
    );
  });
};

//.................................................................................................................

exports.PreviousMilkCollection = async (req, res) => {
  const {
    code,
    date,
    time,
    animal,
    liters,
    fat,
    snf,
    amt,
    degree,
    rate,
    cname,
    acccode,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      //       // Get the current date in YYYY-MM-DD format
      //       const currentDate = new Date().toISOString().split("T")[0];
      //
      //       // Get the current hour to determine AM or PM
      //       const currentHour = new Date().getHours();
      //       const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id)
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          date,
          time,
          animal,
          liters,
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          cname,
          code,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// Upload Previous Milk Collection Excel ..........................
//.................................................................

exports.UploadPreviousMilkCollection = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
//  Previous Milk Collection List  ................................
//.................................................................

exports.PreviousMilkCollectionList = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// Save Previous Milk Collection ..........................
//.........................................................

//get rate from rate chart and calculate amount....................................................................

exports.getRateAmount = (req, res) => {
  const { rccode, rcdate, fat, snf, time, animal, liters } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    if (!dairy_id) {
      connection.release();
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    const getRateAmt = `
    SELECT rate FROM mysql_4234_inventory11.ratemaster WHERE companyid = ? AND center_id = ? AND rcdate <= ? AND fat = ? AND snf = ? AND ME = ? AND CB = ? ORDER BY rcdate DESC LIMIT 1
  `;
    // in query
    // rcdate is lessthan or equal to ratechartdate

    connection.query(
      getRateAmt,
      [dairy_id, center_id, rccode, rcdate, fat, snf, time, animal],
      (err, results) => {
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Rate not found for the provided parameters." });
        }

        const rate = results[0].rate;

        // Ensure 'liters' is a number
        const litersNumber = parseFloat(liters);
        if (isNaN(litersNumber)) {
          return res.status(400).json({ message: "Invalid value for liters." });
        }

        const amt = litersNumber * parseFloat(rate);

        res.status(200).json({ rate: parseFloat(rate), amt });
      }
    );
  });
};

//.................................................................................................................

exports.PreviousMilkCollection = async (req, res) => {
  const {
    code,
    date,
    time,
    animal,
    liters,
    fat,
    snf,
    amt,
    degree,
    rate,
    cname,
    acccode,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      //       // Get the current date in YYYY-MM-DD format
      //       const currentDate = new Date().toISOString().split("T")[0];
      //
      //       // Get the current hour to determine AM or PM
      //       const currentHour = new Date().getHours();
      //       const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id)
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          date,
          time,
          animal,
          liters,
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          cname,
          code,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// Upload Previous Milk Collection Excel ..........................
//.................................................................

exports.UploadPreviousMilkCollection = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
//  Previous Milk Collection List  ................................
//.................................................................

exports.PreviousMilkCollectionList = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// Save Mobile Milk Collection (single entry) .............

exports.mobileMilkCollection = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      const user = req.user.user_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// fetch Mobile Milk Collection (for mobile collector) ................
//.................................................................

// exports.fetchMobileMilkColl = async (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const user = req.user.user_id;
//       const center_id = req.user.center_id;
//
//       // Check if dairy_id, user_role, and center_id are available
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Missing required fields" });
//       }
//
//       // Get the current date in YYYY-MM-DD format
//       const currentDate = new Date().toISOString().split("T")[0];
//
//       // Get the current hour to determine AM or PM
//       const currentHour = new Date().getHours();
//       const ME = currentHour < 12 ? 0 : 1;
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       // Prepare the SQL query without the trailing comma and ensure `date` is currentDate
//       const milkcollReport = `
//         SELECT ReceiptDate, Litres, cname, rno, SampleNo
//         FROM ${dairy_table}
//         WHERE companyid = ? AND center_id = ? AND ReceiptDate = ? AND userid = ? AND ME = ?
//       `;
//
//       // Execute the query
//       connection.query(
//         milkcollReport,
//         [
//           dairy_id,
//           center_id,
//           currentDate, // Pass the current date to the query
//           user, // Ensure user_role is passed correctly
//           ME,
//         ],
//         (err, result) => {
//           connection.release();
//
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           // If there are no records for the given day, send an empty result with a success status
//           if (result.length === 0) {
//             return res.status(200).json({ mobileMilk: [] }); // Return empty array instead of 404
//           }
//
//           res.status(200).json({ mobileMilk: result });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2 function
exports.fetchMobileMilkColl = async (req, res) => {
  const { date } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user = req.user.user_id;
      const center_id = req.user.center_id;
      // Check if dairy_id, user_role, and center_id are available
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query without the trailing comma and ensure `date` is currentDate
      const milkcollReport = `
        SELECT ReceiptDate, Litres, cname, rno, SampleNo, ME
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND userid = ?
      `;

      // Execute the query
      connection.query(
        milkcollReport,
        [center_id, date, user],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // If there are no records for the given day, send an empty result with a success status
          if (result.length === 0) {
            return res.status(200).json({ mobileMilk: [] }); // Return empty array instead of 404
          }
          res.status(200).json({ mobileMilk: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................................
// Fetch code & Liter to Show prev ................................
//.................................................................

// exports.fetchPrevLiters = async (req, res) => {
//   const { date } = req.query;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const user = req.user.user_id;
//       const center_id = req.user.center_id;
//
//       // Check if dairy_id, user_role, and center_id are available
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Missing required fields" });
//       }
//
//
//       // Get the current hour to determine AM or PM
//       const currentHour = new Date().getHours();
//       const ME = currentHour < 12 ? 0 : 1;
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       // Prepare the SQL query without the trailing comma and ensure `date` is currentDate
//       const prevliterReport = `
//         SELECT rno , Litres
//         FROM ${dairy_table}
//         WHERE center_id = ? AND ReceiptDate = ? AND userid = ? AND ME = ?
//       `;
//
//       // Execute the query
//       connection.query(
//         prevliterReport,
//         [center_id, date, user, ME],
//         (err, result) => {
//           connection.release();
//
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           // If there are no records for the given day, send an empty result with a success status
//           if (result.length === 0) {
//             return res.status(200).json({ PrevLiters: [] }); // Return empty array instead of 404
//           }
//
//           res.status(200).json({ PrevLiters: result });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2 function
exports.fetchPrevLiters = async (req, res) => {
  const { date } = req.query;

  // If no date is provided, return an error
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  // Convert the date to one day earlier
  const adjustToPreviousDate = (inputDate) => {
    const parsedDate = new Date(inputDate);
    parsedDate.setDate(parsedDate.getDate() - 1);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const previousDate = adjustToPreviousDate(date);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user = req.user.user_id;
      const center_id = req.user.center_id;

      // Check if dairy_id, user, and center_id are available
      if (!dairy_id || !user || !center_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Determine the current shift (ME: 0 for Morning, 1 for Evening)
      const currentHour = new Date().getHours();
      const ME = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const prevliterReport = `
        SELECT rno, Litres 
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND userid = ? AND ME = ?
      `;

      // Execute the query
      connection.query(
        prevliterReport,
        [center_id, previousDate, user, ME],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // If no records are found, return an empty result
          if (result.length === 0) {
            return res.status(200).json({ PrevLiters: [] });
          }

          res.status(200).json({ PrevLiters: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// (Update) fetch Mobile Milk Collection .................
//.........................................................

exports.fetchMobileMilkCollection = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      // Check if dairy_id, user_role, and center_id are available
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const milkcollReport = `
        SELECT Litres, cname, rno, SampleNo
        FROM ${dairy_table}
        WHERE ReceiptDate = ? AND companyid = ? AND center_id = ?  AND ME = ? AND Driver = "1"
      `;

      // Execute the query
      connection.query(
        milkcollReport,
        [currentDate, dairy_id, center_id, time],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(200).json({ mobileMilk: [] }); // Return empty array instead of 404
          }

          res.status(200).json({ mobileMilkcoll: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// Update Mobile Milk Collection ..........................
//.........................................................

exports.updateMobileCollection = async (req, res) => {
  const { code, fat, snf, amt, degree, rate, acccode, sample } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // // Get the current hour to determine AM or PM
      // const currentHour = new Date().getHours();
      // const time = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const updatemilkcollection = `
         UPDATE ${dairy_table}
          SET  fat = ?,  snf = ?,  Amt = ?,  GLCode = ?,  AccCode = ?,  Digree = ?,  rate = ?,  updatedOn = ?,  UpdatedBy = ? 
          WHERE  companyid = ? AND  center_id = ? AND  rno = ? AND  SampleNo = ?
      `;

      // Execute the query
      connection.query(
        updatemilkcollection,
        [
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          currentDate,
          user_role,
          dairy_id,
          center_id,
          code,
          sample,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res
            .status(200)
            .json({ message: "Milk collection updated successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//...............................................................
// Milk Collection Report (use to Fillter).......................
//...............................................................

exports.allMilkCollReport = async (req, res) => {
  const { fromDate, toDate } = req.query; // Read from `req.query`

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        return res
          .status(400)
          .json({ message: "Dairy ID not found in the request!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const milkCollectionQuery = `
        SELECT 
          ReceiptDate, 
          ME, 
          CB, 
          Litres, 
          fat, 
          snf, 
          rate, 
          Amt, 
          cname, 
          rno
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ?
      `;

      connection.query(
        milkCollectionQuery,
        [fromDate, toDate],
        (err, results) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err.message);
            return res.status(500).json({ message: "Error executing query" });
          }

          if (results.length === 0) {
            return res.status(200).json({
              milkcollection: [],
              message: "No record found!",
            });
          }

          res.status(200).json({ milkcollection: results });
        }
      );
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//...............................................................
// Milk Collection of MilkCollector (for admin) .................
//...............................................................

// exports.allMilkCollection = async (req, res) => {
//   const { fromDate, toDate } = req.query;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err.message);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         return res
//           .status(400)
//           .json({ message: "Dairy ID not found in the request!" });
//       }
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       const milkCollectionQuery = `
//         SELECT
//          userid, ReceiptDate, ME,  CB,  Litres,  fat,  snf,  rate,  Amt,  cname,  rno, SampleNo
//         FROM ${dairy_table}
//         WHERE ReceiptDate BETWEEN ? AND ? AND Driver = 1
//       `;
//
//       connection.query(
//         milkCollectionQuery,
//         [fromDate, toDate],
//         (err, results) => {
//           connection.release();
//
//           if (err) {
//             console.error("Error executing query: ", err.message);
//             return res.status(500).json({ message: "Error executing query" });
//           }
//
//           if (results.length === 0) {
//             return res.status(200).json({
//               milkCollectorcoll: [],
//               message: "No record found!",
//             });
//           }
//           res.status(200).json({ milkCollectorcoll: results });
//         }
//       );
//     } catch (err) {
//       connection.release();
//       console.error("Unexpected error: ", err.message);
//       res.status(500).json({ message: "Unexpected server error" });
//     }
//   });
// };

//v2 function
exports.allMilkCollection = async (req, res) => {
  const { fromDate, toDate } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        return res
          .status(400)
          .json({ message: "Dairy ID not found in the request!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      let milkCollectionQuery;
      let queryParams;

      if (center_id === 0) {
        // Query for center_id = 0
        milkCollectionQuery = `
          SELECT 
            userid, ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno, SampleNo
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND Driver = 1
        `;
        queryParams = [fromDate, toDate];
      } else {
        // Query for center_id != 0
        milkCollectionQuery = `
          SELECT 
            userid, ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno, SampleNo
          FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? AND Driver = 1
        `;
        queryParams = [center_id, fromDate, toDate];
      }

      connection.query(milkCollectionQuery, queryParams, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            milkCollectorcoll: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ milkCollectorcoll: results });
      });
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//...............................................................
// Fetch dairy Milk Collection Report ...........................
//...............................................................

exports.todaysMilkCollReport = async (req, res) => {
  const { date } = req.query; // Read from `req.query`

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        return res
          .status(400)
          .json({ message: "Dairy ID not found in the request!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const todaysMilkQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno
        FROM ${dairy_table}
        WHERE companyid = ? AND center_id = ? AND ReceiptDate = ?
      `;

      connection.query(
        todaysMilkQuery,
        [dairy_id, center_id, date],
        (err, results) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err.message);
            return res.status(500).json({ message: "Error executing query" });
          }

          if (results.length === 0) {
            return res.status(200).json({
              todaysmilk: [],
              message: "No record found!",
            });
          }

          res.status(200).json({ todaysmilk: results });
        }
      );
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//.............................................................................
// Fetch dairy Milk Collection Report Customer Wise ...........................
//.............................................................................

exports.custWiseMilkCReort = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    const queries = {
      morning: `
        SELECT fat, snf, rate, Litres, Amt 
        FROM dailymilkentry_102 
        WHERE ReceiptDate BETWEEN ? AND ? AND ME = 0 AND dairy_id = ? AND center_id = ?
      `,
      evening: `
        SELECT fat, snf, rate, Litres, Amt 
        FROM dailymilkentry_102 
        WHERE ReceiptDate BETWEEN ? AND ? AND ME = 1 AND dairy_id = ? AND center_id = ?
      `,
      total: `
        SELECT SUM(Litres) AS totalLitres, COUNT(DISTINCT AccCode) AS totalCustomers, SUM(Amt) AS totalAmount
        FROM dailymilkentry_102 
        WHERE ReceiptDate BETWEEN ? AND ? AND dairy_id = ? AND center_id = ?
      `,
    };

    const queryParams = [formDate, toDate, dairy_id, center_id];

    Promise.all([
      connection.query(queries.morning, queryParams),
      connection.query(queries.evening, queryParams),
      connection.query(queries.total, queryParams),
    ])
      .then(([morningResults, eveningResults, totalResults]) => {
        connection.release();
        const totalData = totalResults[0] || {
          totalLitres: 0,
          totalCustomers: 0,
          totalAmount: 0,
        };

        res.status(200).json({
          morningData: morningResults,
          eveningData: eveningResults,
          totalMilk: totalData.totalLitres,
          totalCustomers: totalData.totalCustomers,
          totalAmount: totalData.totalAmount,
          message: "Data Found!",
        });
      })
      .catch((err) => {
        connection.release();
        console.error("Error executing queries: ", err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

//.......................................................................
// Update dairy Milk Collection Customer Wise ...........................
//.......................................................................

exports.updateMilkCollCustWise = async (req, res) => {};

//.......................................................................
// Delete Perticular (Time / Date) Milk Collection Customer Wise ........
//.......................................................................

exports.DeleteMilkCollCustWise = async (req, res) => {};

//.......................................................................
// Delete All Milk Collection Of Perticular Customer.....................
//.......................................................................

exports.DeleteAllMilkCollCustomer = async (req, res) => {};

//.........................................................
// Save Milk Collection ...................................
//.........................................................

// ..................................................
// todays milk report for Admin .....................
// ..................................................

exports.todaysReport = async (req, res) => {
  const { formDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    const morningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate BETWEEN ? AND ? AND ME = 0 AND dairy_id = ? AND center_id = ?
    `;
    const eveningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate BETWEEN ? AND ? AND ME = 1 AND dairy_id = ? AND center_id = ?
    `;
    const totalMilkQuery = `
      SELECT SUM(Litres) AS totalLitres, COUNT(DISTINCT AccCode) AS totalCustomers, SUM(Amt) AS totalAmount
      FROM dailymilkentry_102 
      WHERE ReceiptDate = ?
    `;

    Promise.all([
      new Promise((resolve, reject) =>
        connection.query(morningQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(eveningQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(totalMilkQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results[0])
        )
      ),
    ])
      .then(([morningData, eveningData, totalResult]) => {
        connection.release();
        const totalMilk = totalResult.totalLitres || 0;
        const totalCustomers = totalResult.totalCustomers || 0;
        const totalAmount = totalResult.totalAmount || 0;

        res.status(200).json({
          morningData,
          eveningData,
          totalMilk,
          totalCustomers,
          totalAmount,

          message: "Data Found !",
        });
      })
      .catch((err) => {
        connection.release();
        console.error("Error executing query: ", err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

// ..........................................
// milk report for customer .................
// ..........................................

exports.milkReport = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get dairy_id from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Query to check if records exist for the given date range
      const checkDatesQuery = `
        SELECT COUNT(*) AS recordCount
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
      `;

      connection.query(
        checkDatesQuery,
        [fromDate, toDate, user_code],
        (err, results) => {
          if (err) {
            connection.release(); // Release the connection back to the pool
            console.error("Error executing date check query: ", err);
            return res
              .status(500)
              .json({ message: "Date check query execution error" });
          }

          const recordCount = results[0].recordCount;
          if (recordCount === 0) {
            connection.release(); // Release the connection back to the pool
            return res
              .status(404)
              .json({ message: "No records found for the given dates!" });
          }

          // Proceed with the milk report query
          const milkreport = `
          SELECT 
            ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt
          FROM ${dairy_table} 
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
          ORDER BY ReceiptDate ASC;
        `;

          const summaryQuery = `
          SELECT 
            SUM(Litres) AS totalLiters,
            AVG(fat) AS avgFat,
            AVG(snf) AS avgSNF,
            SUM(Amt) AS totalAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
        `;

          connection.query(
            milkreport,
            [fromDate, toDate, user_code],
            (err, records) => {
              if (err) {
                connection.release(); // Release the connection back to the pool
                console.error("Error executing records query: ", err);
                return res
                  .status(500)
                  .json({ message: "Query execution error" });
              }

              connection.query(
                summaryQuery,
                [fromDate, toDate, user_code],
                (err, summaryResults) => {
                  connection.release(); // Release the connection back to the pool

                  if (err) {
                    console.error("Error executing summary query: ", err);
                    return res
                      .status(500)
                      .json({ message: "Summary query execution error" });
                  }

                  const summaryData = summaryResults[0]; // The aggregated data

                  res
                    .status(200)
                    .json({ records: records, summary: summaryData });
                }
              );
            }
          );
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ............................................
// Dashboard Info Admin .......................
// ............................................

exports.dashboardInfo = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Get dairy_id from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const getMonthsDairyInfo = `
      SELECT 
                SUM(Litres) AS totalLiters,
                SUM(Amt) AS totalAmount,
                ReceiptDate,
                SUM(Litres) AS dailyLiters,
                SUM(Amt) AS dailyAmount
              FROM ${dairy_table}
              WHERE ReceiptDate BETWEEN ? AND ? 
              GROUP BY ReceiptDate WITH ROLLUP;
      `;

      // Execute the query
      connection.query(
        getMonthsDairyInfo,
        [fromDate, toDate],
        (err, results) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Database query error" });
          }

          // Separate total and daily data
          let totalLiters = 0;
          let totalAmount = 0;
          const dailyData = [];

          results.forEach((row) => {
            if (row.ReceiptDate === null) {
              totalLiters = row.totalLiters;
              totalAmount = row.totalAmount;
            } else {
              dailyData.push({
                date: row.ReceiptDate,
                liters: row.dailyLiters,
                amount: row.dailyAmount,
              });
            }
          });

          // Send the response
          res.status(200).json({
            totalLiters,
            totalAmount,
            dailyData,
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ............................................
// Dashboard Info Admin .......................
// ............................................

// ............................................
// Dashboard Info Admin .......................
// ............................................
// ............................................
// Dashboard Info Admin .......................
// ............................................
// ............................................
// Dashboard Info Admin .......................
// ............................................
