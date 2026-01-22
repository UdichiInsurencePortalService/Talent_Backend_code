const router = require("express").Router();
const { validateExamEntry } = require("../Controller/examEntryController");

router.post("/exam/validate", validateExamEntry);

module.exports = router;
