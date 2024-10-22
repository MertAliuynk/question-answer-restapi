const User = require("../../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const Question = require("../../models/question");
const Answer = require("../../models/answer");
const checkUserExist = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return next(new CustomError(400,"bu id ye sahip user yok"));
    }
    next();
})
const checkQuestionExist = asyncErrorWrapper(async(req,res,next)=>{
    const id = req.params.id||req.params.question_id;
    const question = await Question.findById(id);
    if(!question){
        return next(new CustomError(400,"bu id ye sahip question yok"));
    }
    next();
});
const checkQuestionAndAnswerExist = asyncErrorWrapper(async(req,res,next)=>{
    const {question_id} = req.params;
    const {answer_id} =req.params;
    const answer =await answer.findOne({
        _id : answer_id,
        question : question_id
    });
    if(!answer){
        return next(new CustomError(400,"bu id ye sahip bir answer yok"));
    }
})
module.exports = {checkUserExist,checkQuestionExist,checkQuestionAndAnswerExist};