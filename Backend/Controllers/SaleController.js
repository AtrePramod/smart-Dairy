const pool = require("../Configs/Database");

// Create Sale with Dynamic Columns
// exports.createSale = async (req, res) => {
//   const { BillNo, BillDate, ...otherFields } = req.body;

//   // Validate required fields
//   if (!BillNo || !BillDate) {
//     return res.status(400).json({
//       success: false,
//       message: "BillNo and BillDate are required fields.",
//     });
//   }

//   // Validate DATETIME format (YYYY-MM-DD HH:mm:ss)
//   const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
//   if (!datetimeRegex.test(BillDate)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid BillDate format. Expected format: YYYY-MM-DD HH:mm:ss",
//     });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     try {
//       // Step 1: Get the total row count from salesmaster
//       connection.query(
//         "SELECT MAX(saleid) AS totalRows FROM salesmaster",
//         (err, countResult) => {
//           if (err) {
//             connection.release();
//             console.error("Error counting rows: ", err);
//             return res
//               .status(500)
//               .json({ message: "Error fetching row count" });
//           }

//           const newSaleId = countResult[0].totalRows + 1; // Generate new saleid

//           // Step 2: Build the INSERT query dynamically
//           let insertQuery = "INSERT INTO salesmaster (saleid, BillNo, BillDate";
//           const insertValues = [newSaleId, BillNo, BillDate];

//           for (const [key, value] of Object.entries(otherFields)) {
//             insertQuery += `, ${key}`;
//             insertValues.push(value);
//           }

//           insertQuery += ") VALUES (?";
//           insertQuery += ", ?".repeat(insertValues.length - 1) + ")";

//           // Step 3: Execute the INSERT query
//           connection.query(insertQuery, insertValues, (err, result) => {
//             connection.release();

//             if (err) {
//               console.error("Error inserting sale record: ", err);
//               return res
//                 .status(500)
//                 .json({ message: "Error creating sale record" });
//             }

//             res.status(201).json({
//               success: true,
//               message: "Sale record created successfully",
//               saleid: newSaleId,
//             });
//           });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Unexpected error: ", error);
//       return res.status(500).json({
//         success: false,
//         message: "Unexpected error occurred",
//         error: error.message,
//       });
//     }
//   });
// };

// Create Sale with Dynamic Columns (Multiple Rows)
exports.createSales = async (req, res) => {
  const salesData = req.body; // Expecting an array of sales objects

  // Validate input
  if (!Array.isArray(salesData) || salesData.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of sales data.",
    });
  }

  for (const sale of salesData) {
    const { BillNo, BillDate } = sale;
    if (!BillNo || !BillDate) {
      return res.status(400).json({
        success: false,
        message: "Each sale must have BillNo and BillDate.",
      });
    }

    // Validate DATETIME format (YYYY-MM-DD HH:mm:ss)
    const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!datetimeRegex.test(BillDate)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid BillDate format. Expected format: YYYY-MM-DD HH:mm:ss",
      });
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Step 1: Get the total row count from salesmaster
      connection.query(
        "SELECT MAX(saleid) AS totalRows FROM salesmaster",
        (err, countResult) => {
          if (err) {
            connection.release();
            console.error("Error counting rows: ", err);
            return res
              .status(500)
              .json({ message: "Error fetching row count" });
          }

          let newSaleId = countResult[0].totalRows || 0; // Start saleid from the current max

          // Step 2: Build the bulk INSERT query dynamically
          let insertQuery = "INSERT INTO salesmaster (saleid, BillNo, BillDate";
          const insertValues = [];
          const valuePlaceholders = [];

          for (const sale of salesData) {
            newSaleId++; // Increment saleid for each sale
            const { BillNo, BillDate, ...otherFields } = sale;
            const rowValues = [newSaleId, BillNo, BillDate];

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

          // Step 3: Execute the bulk INSERT query
          connection.query(insertQuery, insertValues, (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting sale records: ", err);
              return res
                .status(500)
                .json({ message: "Error creating sale records" });
            }

            res.status(201).json({
              success: true,
              message: "Sale records created successfully",
              insertedRows: result.affectedRows,
            });
          });
        }
      );
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

//getting all sales
// exports.getAllSales = async (req, res) => {
//   const query = `SELECT * FROM salesmaster`;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     connection.query(query, (err, result) => {
//       connection.release();

//       if (err) {
//         console.error("Error executing query: ", err);
//         return res.status(500).json({ message: "Error fetching sales data" });
//       }

//       if (result.length === 0) {
//         return res.status(404).json({ message: "No sales data found" });
//       }

//       res.status(200).json({
//         success: true,
//         total: result.length,
//         salesData: result,
//       });
//     });
//   });
// };
exports.getPaginatedSales = async (req, res) => {
  const { date1, date2, fcode, ...dynamicFields } = req.query;

  let query = `
    SELECT * 
    FROM salesmaster 
    WHERE 1=1`;
  let countQuery = `
    SELECT COUNT(*) AS totalRecords 
    FROM salesmaster 
    WHERE 1=1`;

  const queryParams = [];

  // Append filters for date range
  if (date1 && date2) {
    query += ` AND BillDate BETWEEN ? AND ?`;
    countQuery += ` AND BillDate BETWEEN ? AND ?`;
    queryParams.push(date1, date2);
  } else {
    query += ` AND BillDate >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND BillDate <= CURDATE()`;
    countQuery += ` AND BillDate >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND BillDate <= CURDATE()`;
  }

  // Append filter for fcode
  if (fcode) {
    query += ` AND CustCode = ?`;
    countQuery += ` AND CustCode = ?`;
    queryParams.push(fcode);
  }

  // Append dynamic fields
  for (const [field, value] of Object.entries(dynamicFields)) {
    if (value) {
      query += ` AND ${field} = ?`;
      countQuery += ` AND ${field} = ?`;
      queryParams.push(value);
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(countQuery, queryParams, (err, countResult) => {
      if (err) {
        connection.release();
        console.error("Error executing count query: ", err);
        return res
          .status(500)
          .json({ message: "Error fetching total record count", error: err });
      }

      const totalRecords = countResult[0]?.totalRecords || 0;

      connection.query(query, queryParams, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error fetching sales data", error: err });
        }

        res.status(200).json({
          success: true,
          totalRecords,
          salesData: result,
        });
      });
    });
  });
};

// Get Sale by SaleID or billNo
exports.getSale = async (req, res) => {
  const { saleid, billNo } = req.params;

  // Validate that either saleid or billNo is provided
  if (!saleid && !billNo) {
    return res.status(400).json({
      success: false,
      message: "Either SaleID or BillNo is required.",
    });
  }

  const identifier = saleid ? saleid : billNo;
  const column = saleid ? "saleid" : "billNo";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const query = `SELECT * FROM salesmaster WHERE ${column} = ?`;
      connection.query(query, [identifier], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            success: false,
            message: `Sale with ${column} ${identifier} not found.`,
          });
        }

        res.status(200).json({
          success: true,
          message: "Sale record retrieved successfully",
          sale: result[0],
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

//delete sale through its saleid
exports.deleteSale = async (req, res) => {
  const { saleid } = req.body; // Extract saleid from the request body

  console.log(saleid);
  // Validate the required field
  if (!saleid) {
    return res.status(400).json({
      success: false,
      message: "saleid is required to delete a sale record.",
    });
  }

  const query = `DELETE FROM salesmaster WHERE saleid = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(query, [saleid], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error deleting sale record from the database" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sale record not found." });
      }

      res.status(200).json({
        success: true,
        message: "Sale record deleted successfully",
      });
    });
  });
};

//update sale through its saleid
exports.updateSale = async (req, res) => {
  const { saleid, ...updateFields } = req.body;

  // Ensure the saleid is provided
  if (!saleid) {
    return res.status(400).json({
      success: false,
      message: "saleid is required to update a sale record.",
    });
  }

  // Ensure at least one field to update is provided
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  // Construct dynamic query
  let updateQuery = "UPDATE salesmaster SET ";
  const updateValues = [];

  // Dynamically build the update query
  for (const [key, value] of Object.entries(updateFields)) {
    updateQuery += `${key} = ?, `;
    updateValues.push(value);
  }

  // Remove trailing comma
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE saleid = ?";
  updateValues.push(saleid); // Add saleid for WHERE clause

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(updateQuery, updateValues, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({ message: "Error updating sale record" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sale record not found or no changes made." });
      }

      res.status(200).json({
        success: true,
        message: "Sale record updated successfully",
      });
    });
  });
};
