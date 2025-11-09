import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData(); // this function fetches analytics data
        const startDate = new Date( endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        const endDate = new Date();
        const dailySalesData = await getDailySalesData(startDate, endDate); // this function fetches daily sales data

    } catch (error) {
        console.log("error in analytics route", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/reports', adminRoute, (req, res) => {
    res.json({ message: "Here are your reports" });
});

export default router;
