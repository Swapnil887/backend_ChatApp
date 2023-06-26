const mongoose = require("mongoose")


const blackListSchema = mongoose.Schema({
    "blacklist":String
})

const BlackListModel = mongoose.model("blacklist",blackListSchema)


module.exports = {BlackListModel}