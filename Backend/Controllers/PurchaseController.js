const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

//------------------------------------------------------------------>
//Purchase Info ---------------------------------------------------->
//------------------------------------------------------------------>

exports.purchaseInfo = async (req, res) => {
  const { formDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get dairy_id and user_code from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;
      const user_id = req.user.user_id;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Combined query to get purchase bills and the summary in a single request
      const purchaseBillsAndSummaryQuery = `
        SELECT 
          BillNo, BillDate, ItemName, Qty, Rate, Amount,
          (SELECT SUM(Qty) FROM salesmaster WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?) AS totalQty,
          (SELECT SUM(Amount) FROM salesmaster WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?) AS totalAmount
        FROM salesmaster 
        WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?
      `;

      // Execute the combined query
      connection.query(
        purchaseBillsAndSummaryQuery,
        [
          dairy_id,
          formDate,
          toDate,
          user_id, // For the totalQty subquery
          dairy_id,
          formDate,
          toDate,
          user_id, // For the totalAmount subquery
          dairy_id,
          formDate,
          toDate,
          user_id, // For the main query
        ],
        (err, result) => {
          connection.release(); // Release the connection

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({
              message: "No purchase bills found for the given criteria.",
            });
          }

          // The total summary (Qty and Amount) will be the same in every row, so take it from the first row
          const { totalQty, totalAmount } = result[0];

          // Respond with the purchase bills and the summary
          res.status(200).json({
            purchaseBill: result,
            psummary: { totalQty, totalAmount }, // Return the summary from the first row
          });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.......................................................//
//.................Deduction Routes......................//
//.......................................................//

exports.paymentDetails = async (req, res) => {
  const { fromDate, toDate } = req.body;

  // Validate request body
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        connection.release(); // Release connection in case of early exit
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const paymentInfoQuery = `
        SELECT ToDate, BillNo, arate, tliters, pamt, damt, namt , MAMT, BAMT
        FROM custbilldetails 
        WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND DeductionId = 0
      `;

      connection.query(
        paymentInfoQuery,
        [dairy_id, user_code, fromDate, toDate],
        (err, result) => {
          connection.release(); // Always release the connection
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }

          // Return the results
          res.status(200).json({ payment: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//............................................
//Deduction Customer Route....................
//............................................

exports.deductionInfo = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const deductionInfo = `
        SELECT ToDate, BillNo, dname, Amt, arate, tliters, pamt, damt, namt
        FROM custbilldetails 
        WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
      `;

      connection.query(
        deductionInfo,
        [dairy_id, user_code, fromDate, toDate],
        (err, result) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }
          res.status(200).json({ otherDeductions: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.release();
    }
  });
};

// exports.deductionInfo = async (req, res) => {
//   const { fromDate, toDate } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_code = req.user.user_code;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const deductionInfo = `
//         SELECT ToDate, BillNo, dname, Amt, MAMT, BAMT
//         FROM custbilldetails
//         WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
//       `;
//
//       connection.query(
//         deductionInfo,
//         [dairy_id, user_code, fromDate, toDate],
//         (err, result) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           if (result.length === 0) {
//             return res.status(404).json({ message: "No records found!" });
//           }
//
//           // // Filter the main deduction (Deductionid "0") and additional deductions (based on dname)
//           // const mainDeduction = result.find((item) => item.DeductionId === 0);
//           // const additionalDeductions = result.filter(
//           //   (item) => item.DeductionId !== 0
//           // );
//
//           // Send the response with separated data
//           res.status(200).json({
//             // mainDeduction: mainDeduction || null,
//             // otherDeductions: additionalDeductions || [],
//             otherDeductions: result,
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//------------------------------------------------------------------>
//Customer deduction Info for Admin ------------------------------------------>
//------------------------------------------------------------------>

exports.allPaymentDetails = async (req, res) => {
  const { fromDate, toDate } = req.body;

  // Validate request body
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release(); // Release connection in case of early exit
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const paymentInfoQuery = `
        SELECT ToDate, BillNo, arate, tliters, pamt, damt, namt , MAMT, BAMT
        FROM custbilldetails 
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        paymentInfoQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release(); // Always release the connection
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }

          // Return the results
          res.status(200).json({ payment: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//added by pramod start

//creating new one and multi purchase items controller
exports.createPurchases = async (req, res) => {
  const purchaseData = req.body; // Expecting an array of purchase objects

  // Validate input
  if (!Array.isArray(purchaseData) || purchaseData.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of purchase data.",
    });
  }

  for (const purchase of purchaseData) {
    const { purchasedate, itemcode, qty, dealerCode } = purchase;
    if (!purchasedate || !itemcode || !qty || !dealerCode) {
      return res.status(400).json({
        success: false,
        message:
          "Each purchase must include purchasedate, itemcode, qty, and dealerCode.",
      });
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Step 1: Build the bulk INSERT query dynamically
      let insertQuery =
        "INSERT INTO PurchaseMaster (purchasedate, itemcode, qty, dealerCode";
      const insertValues = [];
      const valuePlaceholders = [];

      for (const purchase of purchaseData) {
        const { purchasedate, itemcode, qty, dealerCode, ...otherFields } =
          purchase;
        const rowValues = [purchasedate, itemcode, qty, dealerCode];

        for (const key of Object.keys(otherFields)) {
          if (!insertQuery.includes(key)) {
            insertQuery += `, ${key}`;
          }
          rowValues.push(otherFields[key]);
        }

        insertValues.push(...rowValues);
        valuePlaceholders.push(`(${rowValues.map(() => "?").join(", ")})`);
      }

      insertQuery += `) VALUES ${valuePlaceholders.join(", ")}`;

      // Step 2: Execute the bulk INSERT query
      connection.query(insertQuery, insertValues, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error inserting purchase records: ", err);
          return res
            .status(500)
            .json({ message: "Error creating purchase records" });
        }

        res.status(201).json({
          success: true,
          message: "Purchase records created successfully",
          insertedRows: result.affectedRows,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

// Get All purchase items controller
exports.getAllPurchases = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      const query = "SELECT * FROM PurchaseMaster";

      connection.query(query, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error fetching purchase records: ", err);
          return res.status(500).json({
            success: false,
            message: "Error retrieving purchase records",
          });
        }

        res.status(200).json({
          success: true,
          message: "Purchase records fetched successfully",
          total: results.length,
          data: results,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};
// Update purchase item controller
exports.updatePurchase = async (req, res) => {
  const { purchaseid, ...updateFields } = req.body;

  // Validate input
  if (!purchaseid) {
    return res.status(400).json({
      success: false,
      message: "Purchase ID is required to update a record.",
    });
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field to update is required.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      // Dynamically construct the update query
      const updateKeys = Object.keys(updateFields).map((key) => `${key} = ?`);
      const updateQuery = `UPDATE PurchaseMaster SET ${updateKeys.join(
        ", "
      )} WHERE purchaseid = ?`;
      const values = [...Object.values(updateFields), purchaseid];

      connection.query(updateQuery, values, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error updating purchase record: ", err);
          return res.status(500).json({
            success: false,
            message: "Error updating purchase record",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No purchase record found with the given ID.",
          });
        }

        res.status(200).json({
          success: true,
          message: "Purchase record updated successfully",
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

// delete purchase item controller
exports.deletePurchase = async (req, res) => {
  const { purchaseid } = req.params;

  // Validate input
  if (!purchaseid) {
    return res.status(400).json({
      success: false,
      message: "Purchase ID is required to delete a record.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      const deleteQuery = "DELETE FROM PurchaseMaster WHERE purchaseid = ?";

      connection.query(deleteQuery, [purchaseid], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error deleting purchase record: ", err);
          return res.status(500).json({
            success: false,
            message: "Error deleting purchase record",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No purchase record found with the given ID.",
          });
        }

        res.status(200).json({
          success: true,
          message: "Purchase record deleted successfully",
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

//added by pramod end
