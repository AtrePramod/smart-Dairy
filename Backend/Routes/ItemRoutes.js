const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
  createMasterGrpItem,
  getAllGrpItems,
} = require("../Controllers/Itemcontroller");

const router = express.Router();

// Sale Routes
//Itemmaster routes
// router.route("/sale/create").post(createItem);
router.route("/item/all").get(verifyToken, getAllItems);
router.route("/grpitem/all").get(getAllGrpItems);
router.route("/item/:id").get(getItemById);
router.route("/item/new").post(verifyToken, createItem);
router.route("/item/update").put(updateItem);
router.route("/item/delete").post(deleteItem);

//itemgroupmaster routes
router.route("/grpitem/new").post(createMasterGrpItem);

module.exports = router;
