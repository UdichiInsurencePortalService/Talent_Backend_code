
const express  = require("express")
const router = express.Router();

const {submitDemo} = require('../Controller/demosubmission')

router.post('/',submitDemo)

module.exports = router