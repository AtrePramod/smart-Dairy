const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  masterDates,
  dairyInfo,
  dairyDashboardInfo,
  updatedetails,
  maxCenterId,
  createCenter,
  updateCenterInfo,
  getCenterDetails,
  getAllcenters,
  maxRateChartNo,
  saveRateChart,
  listRatecharts,
  applyRateChart,
  rateChartMilkColl,
  getSelectedRateChart,
  updateSelectedRateChart,
} = require("../Controllers/DairyController");
const router = express.Router();

//dairy routes
router.route("/dairy/masters").post(masterDates);
router.route("/dairy/dashboard").post(verifyToken, dairyDashboardInfo);
router.route("/dairyinfo").post(verifyToken, dairyInfo);
router.route("/update/dairyinfo").post(verifyToken, updatedetails);
router.route("/center/maxid").post(verifyToken, maxCenterId);
router.route("/create/center").post(verifyToken, createCenter);
router.route("/update/centerdetails").post(verifyToken, updateCenterInfo);
router.route("/center/details").post(verifyToken, getCenterDetails);
router.route("/all/centerdetails").post(verifyToken, getAllcenters);
// rate chart
router.route("/ratechart/maxrccode").post(verifyToken, maxRateChartNo);
router.route("/upload/ratechart").post(verifyToken, saveRateChart); //rate chart upload
router.route("/ratechart/list").post(verifyToken, listRatecharts);
router.route("/apply/ratechart").post(verifyToken, applyRateChart);
router.route("/sankalan/ratechart").post(verifyToken, rateChartMilkColl);
router.route("/selected/ratechart").get(verifyToken, getSelectedRateChart);
router.route("/update/ratechart").post(verifyToken, updateSelectedRateChart);

module.exports = router;
