const router = require("express").Router();
const { sendExamToCandidates } = require("../Controller/examLinkController");

router.post("/exam/send-link", sendExamToCandidates);

module.exports = router;
