const pool = require("../Configs/Database");

// Create Sale with Dynamic Columns (Multiple Rows)
exports.createSales = async (req, res) => {
  const salesData = req.body; // Expecting an array of sales objects
  const dairy_id = req.user.dairy_id; // Assuming dairy_id is coming from the authenticated user
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
          let insertQuery =
            "INSERT INTO salesmaster (saleid, BillNo, BillDate, companyid";
          const insertValues = [];
          const valuePlaceholders = [];

          for (const sale of salesData) {
            newSaleId++; // Increment saleid for each sale
            const { BillNo, BillDate, ...otherFields } = sale;
            const rowValues = [newSaleId, BillNo, BillDate, dairy_id]; // Adding dairy_id (companyid) for each sale

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

//its use for getting all sales with dynamic query
exports.getPaginatedSales = async (req, res) => {
  const { date1, date2, fcode, ...dynamicFields } = req.query;
  const dairy_id = req.user.dairy_id;

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
    query += ` AND BillDate = CURDATE()`;
    countQuery += ` AND BillDate = CURDATE()`;
  }

  // Append filter for fcode
  if (fcode) {
    query += ` AND CustCode = ?`;
    countQuery += ` AND CustCode = ?`;
    queryParams.push(fcode);
  }

  if (dairy_id) {
    query += ` AND companyid = ?`; // Assuming companyid column exists in salesmaster
    countQuery += ` AND companyid = ?`;
    queryParams.push(dairy_id);
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
  const dairy_id = req.user.dairy_id;

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
      // Modified query to include dairy_id and companyid filter
      const query = `
        SELECT * 
        FROM salesmaster 
        WHERE ${column} = ? 
        AND companyid = ?`; // Add condition to filter by companyid
      connection.query(query, [identifier, dairy_id], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            success: false,
            message: `Sale with ${column} ${identifier} not found for the given company.`,
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
  const { saleid } = req.body;
  const dairy_id = req.user.dairy_id;

  // Validate the required field
  if (!saleid) {
    return res.status(400).json({
      success: false,
      message: "saleid is required to delete a sale record.",
    });
  }

  const query = `
    DELETE FROM salesmaster 
    WHERE saleid = ? 
    AND companyid = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(query, [saleid, dairy_id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error deleting sale record from the database" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Sale record not found or does not belong to your company.",
        });
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
  const dairy_id = req.user.dairy_id;

  if (!saleid) {
    return res.status(400).json({
      success: false,
      message: "saleid is required to update a sale record.",
    });
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  let updateQuery = "UPDATE salesmaster SET ";
  const updateValues = [];

  // Dynamically build the update query
  for (const [key, value] of Object.entries(updateFields)) {
    updateQuery += `${key} = ?, `;
    updateValues.push(value);
  }

  // Remove trailing comma
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE saleid = ? AND companyid = ?";
  updateValues.push(saleid, dairy_id);

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
