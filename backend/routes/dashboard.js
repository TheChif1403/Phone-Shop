const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Route hiển thị dashboard
router.get("/", dashboardController.renderDashboard);

module.exports = router;