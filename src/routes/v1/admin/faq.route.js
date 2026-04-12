const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const { createFAQ, getFAQ, deleteFAQ, getFAQById, editFAQ, getAllQueries, deleteQuery, replyQuery, getQueryById } = require("../../../controllers/admin.controller/faq.controller");
const validate = require("../../../middlewares/validate");
const { adminValidation } = require("../../../validations");

const FAQRouter = Router()

// FAQRouter.use(auth())
FAQRouter.route("/")
    .post(auth(), validate(adminValidation.postFAQ), createFAQ)
    .get(getFAQ)
    .delete(auth(), validate(adminValidation.deleteIds), deleteFAQ)
    FAQRouter.route("/help-support")
        .get(validate(adminValidation.getData),getAllQueries)
        .delete(validate(adminValidation.deleteIds),deleteQuery)
FAQRouter.route("/:id")
    .get(validate(adminValidation.getContent), getFAQById)
FAQRouter.route("/edit/:id")
    .post(auth(), validate(adminValidation.editFAQ), editFAQ)
FAQRouter.route("/help-support/:id")
    .post(replyQuery)
    .get(validate(adminValidation.getContent),getQueryById)
module.exports = FAQRouter