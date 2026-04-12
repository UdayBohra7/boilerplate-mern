const { Router } = require("express");
const adminAuth = require("../../../middlewares/adminAuth");
const { dashboardController } = require("../../../controllers/admin.controller");

const dashboardRouter = Router()
dashboardRouter.use(adminAuth())

dashboardRouter.route("/analytics").get(dashboardController.getAnalyticsStats)

dashboardRouter.route("/counts").get(dashboardController.getDashboardCountsData)
dashboardRouter.route("/engagement-graph").get(dashboardController.getEngagementGraphData)
dashboardRouter.route("/daily-engagement-analytics").get(dashboardController.getDailyEngagementAnalytics)
dashboardRouter.route("/user-graph").get(dashboardController.getUserGraphData)

module.exports = dashboardRouter
