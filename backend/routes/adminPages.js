const express = require('express');
const router = express.Router();

const revenueController = require('../controllers/revenueController');
const performanceController = require('../controllers/performanceController');
const adsController = require('../controllers/adsController');
const financeController = require('../controllers/financeController');
const settingsController = require('../controllers/settingsController');
const customersController = require('../controllers/customersController');

router.get('/revenue', revenueController.getRevenuePage);
router.get('/performance', performanceController.getPerformancePage);
router.get('/ads', adsController.getAdsPage);
router.get('/finance', financeController.getFinancePage);
router.get('/settings', settingsController.getSettingsPage);
router.get('/customers', customersController.getCustomersPage);
module.exports = router;