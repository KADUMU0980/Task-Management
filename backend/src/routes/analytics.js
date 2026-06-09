const express = require('express');
const router = express.Router();
const { getDashboardStats, getWeeklyData, getMonthlyData, getActivityLogs } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/weekly', getWeeklyData);
router.get('/monthly', getMonthlyData);
router.get('/activity', getActivityLogs);

module.exports = router;
