const mongoose =  require("mongoose")

const connection  = mongoose.connect("mongodb+srv://swapnil:swapnil@cluster0.tush2vw.mongodb.net/mock_1?retryWrites=true&w=majority")


module.exports = {connection}