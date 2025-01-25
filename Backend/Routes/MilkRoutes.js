const express = require("express");
const {
  todaysReport,
  milkReport,
  dashboardInfo,
  custDetails,
  getRateAmount,
  milkCollection,
  saveRateChart,
  milkCollectionOneEntry,
  mobileMilkCollection,
  allMilkCollReport,
  fetchMobileMilkColl,
  fetchMobileMilkCollection,
  updateMobileCollection,
  allMilkCollection,
  fetchPrevLiters,
  todaysMilkCollReport,
} = require("../Controllers/MilkController");
const verifyToken = require("../Middlewares/VerifyToken");

const router = express.Router();
// Milk Routes

router.route("/milk/report").post(todaysReport);
router.route("/milkreport").post(verifyToken, milkReport);
router.route("/dashboard").post(verifyToken, dashboardInfo);

//Milk Collection Customer Name
router.route("/collection/custdata").post(verifyToken, custDetails);
router.route("/collection/milkrate").post(verifyToken, getRateAmount);

//dairy milk collection ........................................................................
router.route("/save/milk/collection").post(verifyToken, milkCollection);
router.route("/milk/sankalan").get(verifyToken, allMilkCollection); //milk collector milk collection
router.route("/save/milk/one").post(verifyToken, milkCollectionOneEntry);

// mobile Milkcollector........................................................................
router
  .route("/save/mobile/milkcollection")
  .post(verifyToken, mobileMilkCollection); // mobile Milkcollector
router.route("/mobile/milkreport").get(verifyToken, fetchMobileMilkColl); // mobile Milkcollector
router.route("/mobile/prevliters").get(verifyToken, fetchPrevLiters); // mobile Milkcollector
router
  .route("/fetch/mobile/collection")
  .get(verifyToken, fetchMobileMilkCollection); // to update
router.route("/update/mobile/coll").post(verifyToken, updateMobileCollection);
//...........................................................................................................



// Customer Routes
module.exports = router;
