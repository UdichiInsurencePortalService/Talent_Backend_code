const express = require("express");
const router = express.Router();

const { submitExam } = require("../Controller/examsubmitcontrollerdb");
const { validateSubmit } = require("../middlewares/examMiddleware");

router.post("/submit", validateSubmit, submitExam);

module.exports = router;