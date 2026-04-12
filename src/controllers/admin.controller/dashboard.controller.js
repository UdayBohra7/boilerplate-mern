const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { dashboardService, engagementService } = require("../../services");


/**
 * Get analytics statistics
 */
const getAnalyticsStats = catchAsync(async (req, res) => {
    const data = await dashboardService.getAnalyticsStats();

    return res.status(httpStatus.OK).send({
        success: true,
        data
    });
});

const getDashboardCountsData = catchAsync(async (req, res) => {
    const data = await dashboardService.getDashboardStatCounts();

    return res.status(httpStatus.OK).send({
        success: true,
        data
    });
});

const getUserGraphData = catchAsync(async (req, res) => {
    const data = await dashboardService.getUserGraphData(req.query.duration)

    return res.status(httpStatus.OK).send({
        success: true,
        data
    });
});

const getEngagementGraphData = catchAsync(async (req, res) => {
    const data = await engagementService.getEngagementRatesForGraph(req.query.duration)

    return res.status(httpStatus.OK).send({
        success: true,
        data
    });
});

const getDailyEngagementAnalytics = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const data = await engagementService.getDailyEngagementAnalytics(startDate, endDate);

    return res.status(httpStatus.OK).send({
        success: true,
        data
    });
});

module.exports = {
    getAnalyticsStats,
    getDashboardCountsData,
    getEngagementGraphData,
    getUserGraphData,
    getDailyEngagementAnalytics,
}
