const express =  require("express")
const router = express.Router();
const {testtaker} = require('../Controller/texttaker')
router.post('/',testtaker)

module.exports = router;