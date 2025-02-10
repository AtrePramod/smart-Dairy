const pool = require("../Configs/Database");

// Get stock records by center_id and dairy_id
exports.getStock = (req, res) => {
  const { dairy_id, center_id } = req.user; // Extracting user details

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const selectQuery = `SELECT * FROM itemStockMaster WHERE center_id = ? AND dairy_id = ?`;

      connection.query(selectQuery, [center_id, dairy_id], (err, results) => {
        connection.release();

        if (err) {
          console.error("Error fetching stock records: ", err);
          return res
            .status(500)
            .json({ message: "Error fetching stock records" });
        }

        res.status(200).json({
          success: true,
          message: "Stock records retrieved successfully",
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

//create new stockmaster controlller
exports.createStock = (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const stock = req.body; // Single stock entry

  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
  };

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Define static column names
      const columns = [
        "ItemCode",
        "ItemName",
        "ItemGroupCode",
        "ItemRate",
        "ItemQty",
        "SaleRate",
        "OpeningDate",
        "dairy_id",
        "center_id",
        "Amount",
        "CreatedBy",
        "CreatedOn",
      ];

      const values = [
        stock.itemcode,
        stock.itemname,
        stock.itemgroupcode,
        stock.rate,
        stock.qty,
        stock.salerate,
        stock.purchasedate,
        dairy_id,
        center_id,
        stock.amount,
        user_id,
        getDefaultDate(),
      ];

      const placeholders = columns.map(() => "?").join(", ");
      const insertQuery = `INSERT INTO itemStockMaster (${columns.join(
        ", "
      )}) VALUES (${placeholders})`;

      connection.query(insertQuery, values, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error inserting stock record: ", err);
          return res
            .status(500)
            .json({ message: "Error creating stock record" });
        }

        res.status(201).json({
          success: true,
          message: "Stock record created successfully",
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

// Delete stock record by itemcode, center_id, and dairy_id
exports.deleteStock = (req, res) => {
  const { dairy_id, center_id } = req.user; // Extracting user details
  const { ItemCode } = req.body; // Getting itemcode from request

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const deleteQuery = `DELETE FROM itemStockMaster WHERE ItemCode = ? AND center_id = ? AND dairy_id = ?`;

      connection.query(
        deleteQuery,
        [ItemCode, center_id, dairy_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error deleting stock record: ", err);
            return res
              .status(500)
              .json({ message: "Error deleting stock record" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Stock record not found" });
          }

          res.status(200).json({
            success: true,
            message: "Stock record deleted successfully",
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

// Update stock record by itemcode, center_id, and dairy_id
exports.updateStock = (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { ItemCode, ItemQty, ItemRate, SaleRate, Amount } = req.body;

  if (!ItemCode) {
    return res.status(400).json({ message: "ItemCode is required" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const updateQuery = `
        UPDATE itemStockMaster 
        SET ItemQty = ?, ItemRate = ?, SaleRate = ? ,Amount=?
        WHERE ItemCode = ? AND center_id = ? AND dairy_id = ?
      `;

      connection.query(
        updateQuery,
        [ItemQty, ItemRate, SaleRate, Amount, ItemCode, center_id, dairy_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error updating stock record: ", err);
            return res
              .status(500)
              .json({ message: "Error updating stock record" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Stock record not found" });
          }

          res.status(200).json({
            success: true,
            message: "Stock record updated successfully",
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
