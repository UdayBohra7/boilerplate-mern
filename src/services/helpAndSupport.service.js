const httpStatus = require('http-status');
const { HelpNSupport } = require('../models/help&support.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a help and support inquiry
 * @param {Object} helpBody
 * @returns {Promise<HelpNSupport>}
 */
const createHelpAndSupport = async (helpBody) => {
    return HelpNSupport.create(helpBody);
};

/**
 * Query for help and support inquiries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHelpAndSupports = async (filter, options) => {
    // Using a simple find with pagination manually if paginate plugin isn't available, 
    // but usually projects have a paginate plugin.
    // Checking model file, it doesn't seem to have paginate plugin attached in the view_file output I saw earlier?
    // Wait, I saw `const HelpNSupport = mongoose.model('HelpNSupport', schema);` in Step 72.
    // It did NOT use `schema.plugin(paginate);`.
    // I should check if I can use the existing `paginate` service function or if I should add the plugin to the model.
    // For consistency with other services (e.g., content.controller used `validations/admin.service` paginate), I'll check that.
    // Actually, standard is usually adding the plugin to the model. 
    // Let's assume I should probably use the `paginate` utility from `admin.service` if the model doesn't have it,
    // or I can standardly implement it.
    // Content controller used: `const { paginate } = require("../../services/admin.service");`

    // However, for this service file, I'll implement a query wrapper or use the admin service's paginate if appropriate.
    // Let's look at `src/services/admin.service.js` to see likely usage.

    // For now, I'll stick to basic Mongoose or assume I can import the common paginate function if I see it.
    // The user didn't ask me to modify the model to add the plugin, but that would be best practice.
    // I'll stick to using the `admin.service` paginate if it's generic, or implement simple pagination here.

    // Let's use the explicit find/skip/limit for now to be safe without the plugin, 
    // or better, I will check `admin.service.js` in a moment.
    // But wait, I need to write this file now.
    // I'll assume standard pagination logic here.

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const docs = await HelpNSupport.find(filter)
        .sort(options.sortBy ? options.sortBy.split(':').join(' ') : 'createdAt')
        .skip(skip)
        .limit(limit);
    const totalResults = await HelpNSupport.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    return {
        results: docs,
        page,
        limit,
        totalPages,
        totalResults,
    };
};

/**
 * Get help and support inquiry by id
 * @param {ObjectId} id
 * @returns {Promise<HelpNSupport>}
 */
const getHelpAndSupportById = async (id) => {
    return HelpNSupport.findById(id);
};

/**
 * Update help and support inquiry by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<HelpNSupport>}
 */
const updateHelpAndSupportById = async (id, updateBody, user) => {
    const helpSupport = await getHelpAndSupportById(id);
    if (!helpSupport) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Help & Support inquiry not found');
    }

    if (updateBody.isResolved && !helpSupport.isResolved) {
        updateBody.resolvedAt = new Date();
        updateBody.resolvedBy = user.id;
    }

    Object.assign(helpSupport, updateBody);
    await helpSupport.save();
    return helpSupport;
};

/**
 * Delete help and support inquiry by id
 * @param {ObjectId} id
 * @returns {Promise<HelpNSupport>}
 */
const deleteHelpAndSupportById = async (id) => {
    const helpSupport = await getHelpAndSupportById(id);
    if (!helpSupport) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Help & Support inquiry not found');
    }
    await helpSupport.remove();
    return helpSupport;
};

module.exports = {
    createHelpAndSupport,
    queryHelpAndSupports,
    getHelpAndSupportById,
    updateHelpAndSupportById,
    deleteHelpAndSupportById,
};
