const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { paginate } = require("../../services/admin.service");
const { Content } = require("../../models/content.model");

const createContent = catchAsync(async (req, res) => {
    const data = await Content.create(req.body)
    res.status(httpStatus.CREATED).send({ data })
})

const getContent = catchAsync(async (req, res) => {
    const { page = 1, limit = 5, search } = req.query;

    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const { data: { data, pagination } } = await paginate(Content, query, page, limit);

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
});


const getContentById = catchAsync(async (req, res) => {
    const { id } = req.params
    const data = await Content.findById(id)
    res.status(httpStatus.OK).send({ data })
})

const editContent = catchAsync(async (req, res) => {
    const { title, description } = req.body
    const { id } = req.params
    const data = await Content.findByIdAndUpdate(id, {
        $set: { title: title, description: description }
    })
    res.status(httpStatus.OK).send({ data })
})

const deleteContent = catchAsync(async (req, res) => {
    const { id } = req.query
    if (!id) return res.status(httpStatus.BAD_REQUEST).send({ message: "Unknown User" })
    const response = await Content.findByIdAndDelete(id)
    return res.status(httpStatus.OK).send({ message: "Content Deleted" })
})

module.exports = { createContent, getContent, getContentById, editContent, deleteContent }