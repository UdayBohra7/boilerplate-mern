const httpStatus = require('http-status').status;
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const helpAndSupportService = require('../../services/helpAndSupport.service');

const getHelpAndSupports = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['isResolved']); // Basic filtering
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await helpAndSupportService.queryHelpAndSupports(filter, options);
    res.send(result);
});

const getHelpAndSupport = catchAsync(async (req, res) => {
    const helpSupport = await helpAndSupportService.getHelpAndSupportById(req.params.helpSupportId);
    if (!helpSupport) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Help & Support inquiry not found');
    }
    res.send(helpSupport);
});

const updateHelpAndSupport = catchAsync(async (req, res) => {
    const helpSupport = await helpAndSupportService.updateHelpAndSupportById(req.params.helpSupportId, req.body, req.user);
    res.send(helpSupport);
});

const deleteHelpAndSupport = catchAsync(async (req, res) => {
    await helpAndSupportService.deleteHelpAndSupportById(req.params.helpSupportId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    getHelpAndSupports,
    getHelpAndSupport,
    updateHelpAndSupport,
    deleteHelpAndSupport,
};
