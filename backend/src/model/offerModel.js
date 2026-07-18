const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:String,

    banner:{
        type:String
    },

    discount:{
        type:Number,
        default:0
    },

    offerType:{
        type:String,
        enum:[
            "festival",
            "seasonal",
            "flash",
            "bank",
            "special"
        ],
        default:"festival"
    },

    startDate:Date,

    endDate:Date,

    isActive:{
        type:Boolean,
        default:true
    },

    redirectUrl:String
},
{
    timestamps:true
});

module.exports=mongoose.model("Offer",offerSchema);