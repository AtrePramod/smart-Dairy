const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const { getAllStocks, createStock } = require("../Controllers/ItemStock");

const router = express.Router();

router.route("/item/stock/all").get(verifyToken, getAllStocks);
router.route("/item/stock/new").post(verifyToken, createStock);

module.exports = router;
