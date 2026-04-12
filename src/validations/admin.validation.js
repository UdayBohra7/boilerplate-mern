const Joi = require('joi');
const { objectId } = require('./custom.validation');

const tagId = {
  body: Joi.object().keys({
    role: Joi.string().required(),
    id: Joi.string().optional(),
  }),
};
const issueTagToUser = {
  body: Joi.object().keys({
    tagId: Joi.custom(objectId).required(),
    userId: Joi.custom(objectId).required(),
  }),
};
const blockTag = {
  body: Joi.object().keys({
    tagId: Joi.custom(objectId).required(),
    action: Joi.string().required(),
  }),
};
const deleteIds = {
  query: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};
const postValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
const slotMachine = {
  body: Joi.object().keys({
    machineId: Joi.string().required(),
    vendingPercentage: Joi.required(),
    status: Joi.string(),
  }),
};

const postContent = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
const getContent = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const editContent = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const postFAQ = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};

const editFAQ = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  }),
};

const getData = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string().allow(''),
  }),
};

const changeStatus = {
  body: Joi.object().keys({
    id: Joi.custom(objectId).required(),
    action: Joi.string().required(),
    model: Joi.string().required(),
  }),
};

// Deleted Product & Community Post Validations

module.exports = {
  tagId,
  issueTagToUser,
  blockTag,
  deleteIds,
  postValidation,
  slotMachine,
  postContent,
  getContent,
  editContent,
  postFAQ,
  editFAQ,
  getData,
  changeStatus,

};
