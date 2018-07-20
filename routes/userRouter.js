const express = require('express');
const router = express.Router();
const tradeControl = require("../control/tradeController")
const authControl = require("../control/authController");
const { authmiddleware } = require('../middleware/authmiddleware');
const { allowmiddleware } = require('../middleware/allowmiddleware');

const app = express();

router.post("/login", authControl.login);

router.post("/createPosition", authmiddleware, allowmiddleware, tradeControl.createPosition);
router.post("/cancelPosition", authmiddleware, allowmiddleware, tradeControl.closePosition);
router.post("/getAllPositions", authmiddleware, tradeControl.getAllPosition);
router.post("/updatePosition", authmiddleware, allowmiddleware, tradeControl.updatePosition);
router.get("/getSymbols", authmiddleware, tradeControl.getSymbols);

module.exports = router;