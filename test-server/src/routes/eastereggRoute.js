// INCLUDES
const express = require("express");
const router = express.Router();
const controller = require("../controllers/eastereggController");

// CONTROLLERS
router.get("/", controller.easteregg);

module.exports = router;
