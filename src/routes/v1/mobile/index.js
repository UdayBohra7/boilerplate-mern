const express = require('express');
const helpAndSupportRoute = require('./helpAndSupport.route');
const contentRoute = require('./content.route');



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
