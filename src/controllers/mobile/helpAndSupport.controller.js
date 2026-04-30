const httpStatus = require('http-status').status;
const catchAsync = require('../../utils/catchAsync');
const helpAndSupportService = require('../../services/helpAndSupport.service');

const createHelpAndSupport = catchAsync(async (req, res) => {
    const helpSupport = await helpAndSupportService.createHelpAndSupport({ ...req.body, userId: req.user.id || req.user._id });
    res.status(httpStatus.CREATED).send({ success: true, data: helpSupport, message: "Help and support created successfully" });
});

module.exports = {
    createHelpAndSupport,
};
