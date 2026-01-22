const express = require('express')
const router = express.Router()
const { organizationmodelHandler } = require('../Controller/organization');


router.post('/',organizationmodelHandler);

module.exports = router;
