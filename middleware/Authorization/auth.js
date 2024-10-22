const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Question = require("../../models/question");
const Answer = require("../../models/answer");

const verifyToken = (req,res,next) =>{
    const {JWT_SECRET_KEY} = process.env;
    const token = req.cookies.authorization;
    if(!token){
        return next(new CustomError(400,"token yok"));
    }
    jwt.verify(token,JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return next(err);
        }
        req.user = {
            id :decoded.id,
            name : decoded.name
        }
        next();
    })
};
const getAdminAccess = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.user;
    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError(400,"admin değil"));
    }
    next();
});
const getQuestionOwnerAccess = asyncErrorWrapper(async(req,res,next)=>{
    const userId = req.user.id;
    const questionId = req.params;
    const  question = await Question.findById(questionId.id);
    if(question.user != userId){
        return next(new CustomError(403,"questionun sahibi değilsin"));
    }
    next();
});
const getAnswerOwnerAccess = asyncErrorWrapper(async(req,res,next)=>{
    const userId = req.user.id;
    const answer_id = req.params.answer_id;   
    const answer = await Answer.findById(answer_id);
    if(answer.user != userId){
        return next(new CustomError(403,"answerin sahibi değilsin"));
    }

    next();
})
module.exports = {verifyToken,getAdminAccess,getQuestionOwnerAccess,getAnswerOwnerAccess};