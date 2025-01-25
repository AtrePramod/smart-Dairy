const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getPaginatedSales,
  deleteSale,
  updateSale,
  getSale,
  createSales,
} = require("../Controllers/SaleController");

const router = express.Router();

// Sale Routes

router.route("/sale/create").post(createSales);
// router.route("/sale/all").get(getAllSales);
router.route("/sale/all").get(getPaginatedSales);
router.route("/sale/:saleid").get(getSale);
router.route("/sale/:billNo").get(getSale);
router.route("/sale/delete").post(deleteSale);
router.route("/sale/update").put(updateSale);

module.exports = router;
