const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const Answer = require("../models/answer");
const Question =require("../models/question");

const addNewAnswerToQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {question_id} = req.params;
    const user_id = req.user.id;
    

    const information = req.body;
    const answer = await Answer.create({
        ...information,
        question : question_id,
        user : user_id
    });
    return res.status(200).json({
        success:true
    }); 

})
const getAllAnswersToQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {question_id} = req.params;

    const question = await Question.findById(question_id).populate("answers");
    const answers = question.answers;
    return res.status(200).json({
        success:true,
        count:answers.length,
        data :answers
    });
})
const getSingleAnswer = asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id).populate("user").populate({
        path : "question",
        select : "title"
    });
    return res.status(200).json({
        success : true,
        data: answer
    });
})
const editAnswer = asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    const {content} = req.body;
    const answer = await Answer.findById(answer_id);
    answer.content = content;
    await answer.save();
    return res.status(200).json({
        success : true,
        data : answer
    })
})
const deleteAnswer = asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    const {question_id} = req.params;
    await Answer.findByIdAndDelete(answer_id);
    const question =await Question.findById(question_id);
    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answercount = question.answer.length;
    await question.save(); 
    return res.status(200).json({
        success:true
    })
});
const likeAnswer = asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);

    if(answer.likes.includes(req.user.id)){
        return next(new CustomError(400,"zaten like atılmış"));
    }
    answer.likes.push(req.user.id);
    await answer.save();
    return res.status(200).json({success:true});

});
const undoLikeAnswer = asyncErrorWrapper(async(req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);
    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError(400,"bu answer kullanıcı tarafından beğenilmemiş"));
    }
    const index = answer.likes.indexOf(req.user.id);  
    answer.likes.splice(index,1);
    await answer.save();
    return res.status(200).json({success:true});
});
module.exports ={addNewAnswerToQuestion,getAllAnswersToQuestion,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undoLikeAnswer};