const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  purchaseInfo,
  deductionInfo,
  paymentDetails,
  allPaymentDetails,
  createPurchases,
  getAllPurchases,
  updatePurchase,
  deletePurchase,
} = require("../Controllers/PurchaseController");
const router = express.Router();

//purchase Routes

router.route("/sales/report").post(verifyToken, purchaseInfo);

//Deduction Routes

router.route("/payment-info").post(verifyToken, paymentDetails);
router.route("/payment/details").post(verifyToken, allPaymentDetails);
router.route("/deduction-info").post(verifyToken, deductionInfo);

//added by Pramo start
router.route("/purchase/new").post(verifyToken, createPurchases);
router.route("/purchase/all").get(verifyToken, getAllPurchases);
router.route("/purchase/update").put(verifyToken, updatePurchase);
router
  .route("/purchase/delete/:purchaseid")
  .delete(verifyToken, deletePurchase);

//added by Pramo end

module.exports = router;
