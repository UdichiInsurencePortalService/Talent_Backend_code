const express = require("express");
const router = express.Router();
const examSubmitController = require("../Controller/examSubmitController");

router.post("/exam/submit", examSubmitController.submitExam);

module.exports = router;
