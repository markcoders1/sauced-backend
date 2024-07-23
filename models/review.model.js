const mongoose = require("mongoose")
const {Schema} = require("mongoose")

const ReviewSchema = new Schema({

    userId: {// the person writing a review
        type: Schema.Types.ObjectId, 
        ref: "users" 
    },
    sauceId:{// the sauce being reviewed by person
        type: Schema.Types.ObjectId, 
        ref: "sauces" 
    },
    star:{// (1|2|3|4|5)
        type:Number, 
        default:0,
        required:true
    },
    text:{
        type:String,
    }

}, {timestamps: true})

module.exports = {
    Review: mongoose.model("reviews", ReviewSchema)
};