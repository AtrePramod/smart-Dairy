const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getStock,
  createStock,
  deleteStock,
  updateStock,
} = require("../Controllers/ItemStockController");

const router = express.Router();

router.route("/item/stock/all").get(verifyToken, getStock);
router.route("/item/stock/new").post(verifyToken, createStock);
router.route("/item/stock/delete").post(verifyToken, deleteStock);
router.route("/item/stock/update").patch(verifyToken, updateStock);

module.exports = router;
