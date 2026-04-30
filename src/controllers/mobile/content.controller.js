const httpStatus = require('http-status').status;
const catchAsync = require('../../utils/catchAsync');
const { Content } = require('../../models/content.model');

const getPrivacyPolicy = catchAsync(async (req, res) => {
    const content = await Content.findOne({ title: { $regex: 'Privacy Policy', $options: 'i' } });
    if (!content) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
    }
    res.send({ success: true, data: content, message: "Privacy Policy fetched successfully" });
});

const getTermsAndConditions = catchAsync(async (req, res) => {
    const content = await Content.findOne({ title: { $regex: 'Terms and Conditions', $options: 'i' } });
    if (!content) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Terms and Conditions not found');
    }
    res.send({ success: true, data: content, message: "Terms and Conditions fetched successfully" });
});

module.exports = {
    getPrivacyPolicy,
    getTermsAndConditions,
};
