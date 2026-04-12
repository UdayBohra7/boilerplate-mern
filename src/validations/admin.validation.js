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

// Product Validations
const createProduct = {
  body: Joi.object().keys({
    product_name: Joi.string().required().trim(),
    product_detail: Joi.string().required().trim(),
    category: Joi.custom(objectId).required(),
    price: Joi.number().required().min(0),
    discount: Joi.number().min(0).max(100).default(0),
    quantity: Joi.number().required().min(0),
    status: Joi.string().valid('Active', 'Inactive').default('Active'),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    product_name: Joi.string().trim(),
    product_detail: Joi.string().trim(),
    category: Joi.custom(objectId),
    price: Joi.number().min(0),
    discount: Joi.number().min(0).max(100),
    quantity: Joi.number().min(0),
    status: Joi.string().valid('Active', 'Inactive'),
    existingImages: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    search: Joi.string().allow(''),
    status: Joi.string().valid('Active', 'Inactive'),
    sortBy: Joi.string(),
  }),
};

const deleteProduct = {
  query: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const changeProductStatus = {
  body: Joi.object().keys({
    id: Joi.custom(objectId).required(),
    status: Joi.string().valid('Active', 'Inactive').required(),
  }),
};

const restoreProduct = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

// Community Post Validations
const createCommunityPost = {
  body: Joi.object().keys({
    title: Joi.string().optional().trim(),
    post_desc: Joi.string().required().trim(),
    status: Joi.string().valid('draft', 'scheduled', 'published').default('draft'),
    scheduled_date: Joi.date().iso().allow(null),
    tags: Joi.array().items(Joi.string().trim()).optional(),
  }),
};

const updateCommunityPost = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().optional().trim(),
    post_desc: Joi.string().trim(),
    status: Joi.string().valid('draft', 'scheduled', 'published'),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    scheduled_date: Joi.date().iso().allow(null),
    existingMedia: Joi.alternatives().try(Joi.string(), Joi.array()),
  }).min(1),
};

const getCommunityPost = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const getCommunityPosts = {
  query: Joi.object().keys({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    search: Joi.string().allow(''),
    status: Joi.string().valid('draft', 'scheduled', 'published'),
    sortBy: Joi.string(),
  }),
};

const deleteCommunityPost = {
  query: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const changeCommunityPostStatus = {
  body: Joi.object().keys({
    id: Joi.custom(objectId).required(),
    status: Joi.string().valid('draft', 'scheduled', 'published').required(),
    scheduled_date: Joi.date().iso().allow(null),
  }),
};

const restoreCommunityPost = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

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
  // Product validations
  createProduct,
  updateProduct,
  getProduct,
  getProducts,
  deleteProduct,
  changeProductStatus,
  restoreProduct,
  // Community Post validations
  createCommunityPost,
  updateCommunityPost,
  getCommunityPost,
  getCommunityPosts,
  deleteCommunityPost,
  changeCommunityPostStatus,
  restoreCommunityPost,
};
