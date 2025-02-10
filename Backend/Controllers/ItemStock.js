const pool = require("../Configs/Database");

exports.getAllStocks = (req, res) => {
  const { dairy_id: dairyId, center_id: centerId } = req.user;
  const { ...dynamicFields } = req.body;
};
exports.createStock = (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const stockData = req.body;

  if (!Array.isArray(stockData) || stockData.length === 0) {
    return res.status(400).json({ message: "Invalid stock data" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      //id, dairy_id, center_id, ItemGroupCode, ItemCode, ItemName, ItemRate, ItemQty, SaleRate, Amount, OpeningDate, CreatedBy, CreatedOn
      // Define static column names
      let columns = [
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
      ];
      let values = [];
      let placeholders = [];

      stockData.forEach((stock) => {
        let rowValues = [
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
        ];

        // Handle dynamic fields
        Object.keys(stock).forEach((key) => {
          if (!columns.includes(key)) {
            columns.push(key);
          }
        });

        values.push(...rowValues);
        placeholders.push(`(${rowValues.map(() => "?").join(", ")})`);
      });

      let insertQuery = `INSERT INTO itemStockMaster (${columns.join(
        ", "
      )}) VALUES ${placeholders.join(", ")}`;

      connection.query(insertQuery, values, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error inserting stock records: ", err);
          return res
            .status(500)
            .json({ message: "Error creating stock records" });
        }

        res.status(201).json({
          success: true,
          message: "Stock records created successfully",
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
