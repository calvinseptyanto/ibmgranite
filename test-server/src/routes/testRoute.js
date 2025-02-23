// INCLUDES
const express = require("express");
const router = express.Router();
const controller = require("../controllers/testController");

// CONTROLLERS
router.post("/upload_pdf", controller.uploadPdf);
router.post("/chatbot", controller.chatbot);

router.get("/key-events", controller.keyEvents);
router.get("/compliance-score", controller.complianceScore);
router.get("/summarizer", controller.summarizer);
router.get("/compliance-obligations-list", controller.complianceObligationsList);

module.exports = router;