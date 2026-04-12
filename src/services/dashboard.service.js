const userService = require("./user.service");
const mealService = require("./meal.service");
const dailyMealService = require("./mobile/dailyMeal.service");
const engagementService = require("./engagement.service");
const { User } = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const getAnalyticsStats = async () => {
    // Get total users with role 'user'
    const totalUsers = await User.countDocuments({ role: 'user', isDeleted: { $ne: true } });

    // Get active users count
    const activeUsers = await User.countDocuments({ role: 'user', status: 'Active', isDeleted: { $ne: true } });

    // Get inactive users count
    const inactiveUsers = await User.countDocuments({ role: 'user', status: 'Inactive', isDeleted: { $ne: true } });

    // Get premium users count
    const premiumUsers = await User.countDocuments({ role: 'user', subscription: 'Premium', isDeleted: { $ne: true } });

    // Get monthly user growth for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    const monthlyGrowth = await User.aggregate([
        {
            $match: {
                role: 'user',
                createdAt: { $gte: startOfYear }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    // Format monthly data (initialize all 12 months with 0)
    const monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    monthlyGrowth.forEach(item => {
        const monthIndex = item._id - 1; // Convert to 0-based index
        monthlyData[monthIndex] = item.count;
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        premiumUsers,
        userGrowth: {
            labels: monthLabels,
            data: monthlyData
        }
    };
}

const getDashboardStatCounts = async () => {
    const totalUser = await userService.getUserCountAndLastMonthRate();
    const totalMealsLogged = await mealService.getMealCountAndLastMonthRate();
    const totalMealPlans = await dailyMealService.getMealPlanCountAndLastMonthRate();
    const engagementRate = await engagementService.getEngagementCountAndLastMonthRate();

    return {
        totalUser,
        totalMealsLogged,
        totalMealPlans,
        engagementRate
    };
}

const getUserGraphData = async (duration) => {
    const now = new Date();
    let startDate, endDate = now;
    let labelFormat, periodFn;

    if (duration === '7d') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        labelFormat = '%Y-%m-%d';
        periodFn = (date) => {
            const d = new Date(date);
            return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        };
    } else if (duration === '1m') {
        const currentMonth = now.getMonth();
        startDate = new Date(now.getFullYear(), currentMonth === 0 ? 11 : currentMonth - 1, 1);
        if (currentMonth === 0) startDate.setFullYear(now.getFullYear() - 1);
        labelFormat = '%Y-%m-%d';
        periodFn = (date) => {
            const d = new Date(date);
            return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        };
    } else if (duration === '1y') {
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        labelFormat = '%Y-%m';
        periodFn = (date) => {
            const d = new Date(date);
            return { year: d.getFullYear(), month: d.getMonth() + 1 };
        };
    } else {
        throw new ApiError(400, 'Invalid duration. It must be one of the following: 7d, 1m, or 1y.');
    }

    let groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
    };
    let sort = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

    if (duration === '1y') {
        groupId = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
        };
        sort = { "_id.year": 1, "_id.month": 1 };
    }

    const userGraphData = await User.aggregate([
        {
            $match: {
                role: 'user',
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: groupId,
                count: { $sum: 1 }
            }
        },
        {
            $sort: sort
        }
    ]);

    const dataMap = {};
    userGraphData.forEach(item => {
        let key;
        if (duration === '1y') {
            key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        } else {
            key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
        }
        dataMap[key] = item.count;
    });

    const labels = [];
    const data = [];
    let current = new Date(startDate);
    while (current <= endDate) {
        const periodKey = duration === '1y'
            ? `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
            : `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;

        labels.push(current.toISOString().split('T')[0]);
        data.push(dataMap[periodKey] || 0);

        if (duration === '1y') {
            current.setMonth(current.getMonth() + 1);
        } else {
            current.setDate(current.getDate() + 1);
        }
    }

    return { labels, data };
};

module.exports = {
    getAnalyticsStats,
    getDashboardStatCounts,
    getUserGraphData,
}