const fs = require("fs");
const path = require("path");
const attendanceModel = require("../Model/attendanceModel");
const { getDistanceMeters } = require("../utils/geoDistance");

exports.submitAttendance = async (req, res) => {
  try {
    const {
      exam_code,
      institution_name,
      fullName,
      fatherName,
      mobileNumber,
      aadharNumber,
      candidateLat,
      candidateLng,
      photoBase64,
    } = req.body;

    if (
      !exam_code ||
      !institution_name ||
      !fullName ||
      !aadharNumber ||
      !photoBase64
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔹 Fetch exam center
    const center = await attendanceModel.getExamCenter(
      exam_code,
      institution_name
    );

    if (!center) {
      return res.status(404).json({ error: "Invalid exam center" });
    }

    // 🔹 Calculate distance
    const distance = getDistanceMeters(
      center.center_lat,
      center.center_lng,
      candidateLat,
      candidateLng
    );

    const attendance_status =
      distance <= center.allowed_radius ? "IN_CENTER" : "OUTSIDE_CENTER";

    // 🔹 Save photo (CORRECT WAY)
    const uploadDir = path.join(__dirname, "../uploads/attendance");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${aadharNumber}.jpg`;
    const fullFilePath = path.join(uploadDir, fileName);

    fs.writeFileSync(
      fullFilePath,
      Buffer.from(photoBase64, "base64")
    );

    // ✅ PUBLIC RELATIVE PATH (THIS IS IMPORTANT)
    const relativePhotoPath = `/uploads/attendance/${fileName}`;

    // 🔹 Save DB
    await attendanceModel.saveAttendance({
      exam_code,
      institution_name,
      full_name: fullName,
      father_name: fatherName,
      mobile_number: mobileNumber,
      aadhar_number: aadharNumber,
      photo_path: relativePhotoPath,
      candidate_lat: candidateLat,
      candidate_lng: candidateLng,
      distance_meters: distance,
      attendance_status,
    });

    res.status(200).json({
      success: true,
      attendance_status,
      distance_meters: distance,
    });
  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    res.status(500).json({ error: "Attendance submission failed" });
  }
};

// -------------------- GET ALL ATTENDANCE -------------------- //
exports.getAllAttendance = async (req, res) => {
  try {
    const data = await attendanceModel.getAllAttendance();

    const host = `${req.protocol}://${req.get("host")}`;

    const updatedData = data.map(item => ({
      ...item,
      photo_url: item.photo_path
        ? `${host}${item.photo_path}`
        : null,
    }));

    res.status(200).json({
      success: true,
      total: updatedData.length,
      data: updatedData,
    });
  } catch (err) {
    console.error("GET ATTENDANCE ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch attendance",
    });
  }
};
