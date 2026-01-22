const express = require("express");
const upload = require("../middlewares/upload");
const examController = require("../Controller/examController");

const router = express.Router();

/* Create Exam */
router.post(
  "/create-exam",
  upload.single("pdf"),
  examController.createExamWithPdf
);

/* Get ALL exams */
router.get(
  "/exams",
  examController.getAllExams
);

/* Get exam by exam code */
router.get(
  "/exam/:examCode",
  examController.getExamByCode
);

router.get(
  "/exam/:examCode/questions",
  examController.getQuestionsByLanguage
);

module.exports = router;
