const mongoose = require("mongoose")
const { paginate, toJSON } = require("./plugins")


const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
},

    {
        timestamps: true,
    })

schema.plugin(paginate);
schema.plugin(toJSON);

const Content = mongoose.model("Content", schema)

module.exports = { Content }