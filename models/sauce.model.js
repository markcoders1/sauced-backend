const mongoose = require("mongoose");
const SauceSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    description: {
        type:String
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image:{
        type:String,
    }
});

module.exports = mongoose.model("sauces", SauceSchema);