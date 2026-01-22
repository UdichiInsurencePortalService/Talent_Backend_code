const express = require("express");
const router = express.Router();
const scheduledExamController = require("../Controller/scheduledExamController");

/*
|--------------------------------------------------------------------------
| Schedule Exam (Admin)
|--------------------------------------------------------------------------
*/
router.post(
  "/schedule-exam",
  scheduledExamController.createScheduledExam
);

/*
|--------------------------------------------------------------------------
| Get All Scheduled Exams
|--------------------------------------------------------------------------
*/
router.get(
  "/scheduled-exams",
  scheduledExamController.getAllScheduledExams
);

/*
|--------------------------------------------------------------------------
| Get Scheduled Exam By Exam Code
|--------------------------------------------------------------------------
*/
router.get(
  "/scheduled-exam/:examCode",
  scheduledExamController.getScheduledExamByCode
);

module.exports = router;
