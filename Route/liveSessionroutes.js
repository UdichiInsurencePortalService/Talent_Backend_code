const router = require("express").Router();
const controller = require("../Controller/liveSession.controller");

router.get("/live-monitoring/:examCode", controller.getLiveMonitoring);

module.exports = router;
