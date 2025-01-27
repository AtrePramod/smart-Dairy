const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  purchaseInfo,
  deductionInfo,
  paymentDetails,
  allPaymentDetails,
} = require("../Controllers/PurchaseController");
const router = express.Router();

//purchase Routes

router.route("/sales/report").post(verifyToken, purchaseInfo);

//Deduction Routes

router.route("/payment-info").post(verifyToken, paymentDetails);
router.route("/payment/details").post(verifyToken, allPaymentDetails);
router.route("/deduction-info").post(verifyToken, deductionInfo);

//added by Pramo start

//added by Pramo end

module.exports = router;
