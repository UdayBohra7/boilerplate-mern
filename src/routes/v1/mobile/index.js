const express = require('express');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const foodAnalysisRoute = require('./foodAnalysis.route');
const mealRoute = require('./meal.route');
const dailyMealRoute = require('./dailyMeal.route');
const communityRoute = require('./community.route');
const journalRoute = require('./journal.route');
const dailyStepsRoute = require('./dailySteps.route');
const helpAndSupportRoute = require('./helpAndSupport.route');
const contentRoute = require('./content.route');
const notificationRoute = require('./notification.route');
const groceryListRoute = require('./groceryList.route');
const appSettingsRoute = require('./appSettings.route');



const router = express.Router();

const mobileRoutes = [
    {
        path: '/help-support',
        route: helpAndSupportRoute,
    },
    {
        path: '/content',
        route: contentRoute,
    },
];


mobileRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
