const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMemory");
const candidateController = require("../Controller/candidateController");

router.post(
  "/candidates/upload",
  upload.single("file"), // 👈 MUST MATCH frontend key
  candidateController.uploadCandidates
);

router.get("/candidates", candidateController.getCandidates);

module.exports = router;
