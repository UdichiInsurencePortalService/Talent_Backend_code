const model = require("../Model/liveSession.model");

exports.getLiveMonitoring = async (req, res) => {
  try {
    const { examCode } = req.params;
    const data = await model.getLiveSessions(examCode);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
