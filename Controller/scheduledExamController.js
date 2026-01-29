const scheduledExamModel = require("../Model/scheduledModel");

/*
|--------------------------------------------------------------------------
| Create Scheduled Exam
|--------------------------------------------------------------------------
*/
exports.createScheduledExam = async (req, res) => {
  try {
  const {
  exam_code,
  exam_name,
  subject_name,
  exam_date,
  exam_time,
  duration_minutes,
  assessor_name,
  institution_name,
  center_city,
  center_area,
  center_lat,
  center_lng,
  allowed_radius
} = req.body;

if (
  !exam_code ||
  !exam_name ||
  !subject_name ||
  !exam_date ||
  !exam_time ||
  !duration_minutes ||
  !institution_name ||
  !center_city ||
  !center_lat ||
  !center_lng
) {
  return res.status(400).json({
    error: "All required fields must be filled",
  });
}

const scheduledExam = await scheduledExamModel.createScheduledExam({
  exam_code,
  exam_name,
  subject_name,
  exam_date,
  exam_time,
  duration_minutes,
  assessor_name,
  institution_name,
  center_city,
  center_area,
  center_lat,
  center_lng,
  allowed_radius
});


    res.status(201).json({
      success: true,
      message: "Scheduled exam created successfully",
      data: scheduledExam,
    });
  } catch (error) {
    console.error("CREATE SCHEDULED EXAM ERROR:", error);
    res.status(500).json({
      error: "Failed to create scheduled exam",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Scheduled Exams
|--------------------------------------------------------------------------
*/
exports.getAllScheduledExams = async (req, res) => {
  try {
    const exams = await scheduledExamModel.getAllScheduledExams();

    res.status(200).json({
      success: true,
      total: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("GET SCHEDULED EXAMS ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch scheduled exams",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Scheduled Exam By Exam Code
|--------------------------------------------------------------------------
*/
exports.getScheduledExamByCode = async (req, res) => {
  try {
    const { examCode } = req.params;

    const exam = await scheduledExamModel.getScheduledExamByCode(examCode);

    if (!exam) {
      return res.status(404).json({
        error: "Scheduled exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("GET SCHEDULED EXAM ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch scheduled exam",
    });
  }
};
