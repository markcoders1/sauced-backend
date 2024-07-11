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
    image:{
        type:String,
        default:"https://markcoders-assets.s3.amazonaws.com/user.png"
    },
    welcome:{
        type:Boolean,
        default: true
    },
    points:{
        type: Number,
        default:0
    }
});

module.exports = mongoose.model("users", UserSchema);
