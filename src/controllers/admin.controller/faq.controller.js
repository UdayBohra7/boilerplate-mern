const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { paginate } = require("../../services/admin.service");
const { FAQ } = require("../../models/faq.model");
const { HelpNSupport } = require("../../models/help&support.model");

const createFAQ = catchAsync(async (req, res) => {
    const data = await FAQ.create(req.body)
    res.status(httpStatus.CREATED).send({ data })
})

const getFAQ = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, search } = req.query;

    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { question: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const { data: { data, pagination } } = await paginate(FAQ, query, page, limit);

        res.status(httpStatus.OK).send({
            success: true,
            message: search ? "Filtered Content Fetched Successfully" : "All Content Fetched Successfully",
            data,
            pagination
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while fetching the Content",
            error: error.message
        });
    }
})

const getFAQById = catchAsync(async (req, res) => {
    const { id } = req.params
    const data = await FAQ.findById(id)
    res.status(httpStatus.OK).send({ data })
})

const editFAQ = catchAsync(async (req, res) => {
    const { answer, question } = req.body
    const { id } = req.params
    const data = await FAQ.findByIdAndUpdate(id, {
        $set: { question: question, answer: answer }
    })
    res.status(httpStatus.OK).send({ data })
})

const deleteFAQ = catchAsync(async (req, res) => {
    const { id } = req.query
    if (!id) return res.status(httpStatus.BAD_REQUEST).send({ message: "Unknown User" })
    const response = await FAQ.findByIdAndDelete(id)
    return res.status(httpStatus.OK).send({ message: "FAQ Deleted" })
})


const getAllQueries = catchAsync(async (req, res) => {
    const { page, limit, search } = req.query;
    let query = {};
    if (search) {
        query = {
            $or: [
                { message: { $regex: search, $options: 'i' } }
            ]
        };
    }
    const { data: { data } } = await paginate(HelpNSupport, query, page, limit)
    return res.status(httpStatus.OK).send({
        success: true,
        message: search ? "Filtered Queries Fetched Successfully" : "All Queries Fetched Successfully",
        data,
    });

})

const getQueryById = catchAsync(async (req, res) => {
    const { id } = req.params
    const data = await HelpNSupport.findById(id)
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Query Not Found" })
    return res.status(httpStatus.OK).send({ success: true, data })
})

const deleteQuery = catchAsync(async (req, res) => {
    const { id } = req.query;
    const data = await HelpNSupport.findByIdAndDelete(id)
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Query Not Found" })
    return res.status(httpStatus.OK).send({ success: true, data })
})

const replyQuery = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await HelpNSupport.findByIdAndUpdate(id, { $set: { isResolved: true } }, { new: true })
    if (!data) return res.status(httpStatus.BAD_REQUEST).send({ message: "Query Not Found" })
    return res.status(httpStatus.OK).send({ success: true, data })
})


module.exports = { createFAQ, getFAQ, getFAQById, editFAQ, deleteFAQ, getAllQueries, getQueryById, deleteQuery, replyQuery }