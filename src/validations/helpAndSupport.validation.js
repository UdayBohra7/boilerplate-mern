const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createHelpAndSupport = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        message: Joi.string().required(),
    }),
};

const getHelpAndSupports = {
    query: Joi.object().keys({
        search: Joi.string(),
        isResolved: Joi.boolean(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getHelpAndSupport = {
    params: Joi.object().keys({
        helpSupportId: Joi.string().custom(objectId),
    }),
};

const updateHelpAndSupport = {
    params: Joi.object().keys({
        helpSupportId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            isResolved: Joi.boolean(),
        })
        .min(1),
};

const deleteHelpAndSupport = {
    params: Joi.object().keys({
        helpSupportId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createHelpAndSupport,
    getHelpAndSupports,
    getHelpAndSupport,
    updateHelpAndSupport,
    deleteHelpAndSupport,
};
