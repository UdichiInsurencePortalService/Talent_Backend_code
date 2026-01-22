const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/json",
  "text/json"
];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Excel (.xlsx), and JSON are allowed"
        )
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

module.exports = upload;
