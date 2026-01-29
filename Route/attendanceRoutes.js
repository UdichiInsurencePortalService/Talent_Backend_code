const express = require("express");
const router = express.Router();
const { submitAttendance } = require("../Controller/attendanceController");
const attendanceController = require("../Controller/attendanceController");


router.post("/attendance/submit", submitAttendance);
router.get("/attendance", attendanceController.getAllAttendance);

module.exports = router;
