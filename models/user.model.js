const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
        min: 6,
    },
    email: {
        type: String,
        required: true,
        unique: this.email != "" ? true : false,
        max: 255,
        min: 6,
    },
    provider: {
        type: String,
        required: false,
    },
    // password: {
    //   type: String,
    //   required: true,
    //   max: 1024,
    //   min: 6,
    // },
    type: {
        type: String,
        default: "user",
    },
    status: {
        type: String,
        default: "active",
    },
    remember_token: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("users", UserSchema);
