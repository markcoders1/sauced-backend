
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FollowSchema = new Schema({
    followGiver: {
        type: Schema.Types.ObjectId, // one who is following
        ref: "users"
    },
    followReciever: {
        type: Schema.Types.ObjectId, // the one who gets followed
        ref: "users"
    }
}, {timestamps: true})



module.exports = mongoose.model("follows", FollowSchema);