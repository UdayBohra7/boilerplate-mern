const express = require('express');
const contentRouter = require('./content.route');
const FAQRouter = require('./faq.route');
const dashboardRouter = require('./dashboard.route');
const userRouter = require("./user.route");
const router = express.Router();
const helpAndSupportRouter = require('./helpAndSupport.route');


router.use("/content", contentRouter)
router.use("/faq", FAQRouter)
router.use("/dashboard", dashboardRouter)
router.use("/user", userRouter);
router.use("/help-support", helpAndSupportRouter);


module.exports = router