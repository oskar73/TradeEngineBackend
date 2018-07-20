const express = require('express');

const router = express.Router();
const thirdPartyController = require('../control/thirdPartyController');
const { thirdPartymiddleware } = require('../middleware/thirdPartymiddleware');

router.post("/createUser", thirdPartymiddleware, thirdPartyController.createUser);
router.post("/blockUser", thirdPartymiddleware, thirdPartyController.blockUser);

module.exports = router;
