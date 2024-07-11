const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const SauceSchema = mongoose.Schema({
    // uid: {
    //     type: String,
    //     required: true,
    // },
    brand:{
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
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