const mongoose = require("mongoose")

const schema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
},

    {
        timestamps: true,
    })
const FAQ = mongoose.model("Faq", schema)

module.exports = { FAQ }