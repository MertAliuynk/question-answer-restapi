const mongoose = require("mongoose");
const Question =require("../models/question");
const expressAsyncHandler = require("express-async-handler");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content : {
        type :String,
        required : [ true,"lütfen contenti gir answer"],
        minlength : [6,"min 6 karakter"]
    },
    creadeAt : {
        type : Date,
        default : Date.now
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"answerin kullanıcısı olmalı"]
    },
    question : {
        type : mongoose.Schema.ObjectId,
        ref : "Question",
        requşred : [true,"answer bir questiona ait olmalı"]
    }

})
AnswerSchema.pre("save",async function(next){
    if (!this.isModified("user")) {
        return next();
    }
    const question = await Question.findById(this.question);
    question.answers.push(this.id);
    question.answercount = question.answers.length;
    await question.save();
    next();
})
module.exports = mongoose.model("Answer",AnswerSchema);