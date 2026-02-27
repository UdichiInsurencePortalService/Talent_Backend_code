const express = require("express");
const router = express.Router();
const {
  submitExam,
  getAllResults,
  getResultByMobile,
} = require("../Controller/examsubmitcontrollerdb");

router.post("/submit", submitExam);
router.get("/results", getAllResults);
router.get("/results/:mobile", getResultByMobile);

module.exports = router;