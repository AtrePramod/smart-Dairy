const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const { createEmployee, updateEmployee, deleteEmployee, employeeList, findEmpByCode } = require("../Controllers/EmpController");

const router = express.Router();

router.route("/create/employee").post(verifyToken, createEmployee);
router.route("/find/employee").post(verifyToken, findEmpByCode);
router.route("/update/employee").post(verifyToken , updateEmployee);
router.route("/delete/employee").post(verifyToken , deleteEmployee);
router.route("/list/employee").post(verifyToken , employeeList);


module.exports = router;