const express = require("express");
const router = express.Router();

// define routes
const testRoute = require("./testRoute");
const eastereggRoute = require("./eastereggRoute");

// use routes
router.use("/", testRoute);

// section b
router.use("/easteregg", eastereggRoute);

module.exports = router;
