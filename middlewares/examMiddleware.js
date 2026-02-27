module.exports.validateSubmit = (req, res, next) => {
  const { exam_code, mobile_number } = req.body;

  if (!exam_code || !mobile_number) {
    return res.status(400).json({ message: "Missing fields" });
  }
  next();
};