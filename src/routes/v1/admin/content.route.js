const { Router } = require("express");
const { createContent, getContent, getContentById, editContent, deleteContent } = require("../../../controllers/admin.controller/content.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");
const auth = require("../../../middlewares/auth");
const adminAuth = require("../../../middlewares/adminAuth");

const contentRouter = Router()
contentRouter.route("/")
    .post(adminAuth(), validate(adminValidation.postContent), createContent)
    .get(adminAuth(), getContent)
    .delete(adminAuth(), validate(adminValidation.deleteIds), deleteContent)
contentRouter.route("/:id").get(validate(adminValidation.getContent), getContentById)
contentRouter.route("/edit/:id").post(adminAuth(), validate(adminValidation.editContent), editContent)

module.exports = contentRouter