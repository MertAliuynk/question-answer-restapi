const asyncErrorWrapper = require("express-async-handler");
const Question = require("../models/question");
const CustomError = require("../helpers/error/CustomError");
const question = require("../models/question");

const  askNewQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const information = req.body;
    const question = await Question.create({

        title : information.title,
        content : information.content,
        user : req.user.id
    });
    res.status(200).json({
        success:true,
        data : question
    })
})  
const getAllQuestions = asyncErrorWrapper(async(req,res,next)=>{

    return res.status(200).json(res.queryResult);
})
const getSingleQuestion = asyncErrorWrapper(async(req,res,next)=>{
    res.status(200).json(res.queryResult);
})
const editQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {id} =req.params;
    const {title,content} = req.body; //burayı information şeklinde yazabilirsin şimdi postmanda çok veri gönderdiğim için bozulmasın diye böyle yaptım

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();
    res.status(200).json({
        success:true,
        data : question
    })
})
const deleteQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const question = await Question.findByIdAndDelete(id);
    res.status(200).json({success:true});
})
const likeQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next(new CustomError(400,"zaten like atılmış"));
    }
    question.likes.push(req.user.id);
    question.likecount = question.likes.length;
    await question.save();
    return res.status(200).json({success:true});

})
const undoLikeQuestion = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const question = await Question.findById(id);
    if(!question.likes.includes(req.user.id)){
        return next(new CustomError(400,"bu question kullanıcı tarafından beğenilmemiş"));
    }
    const index = question.likes.indexOf(req.user.id);  
    question.likes.splice(index,1);
    question.likecount = question.likes.length;
    await question.save();
    return res.status(200).json({success:true});
})

module.exports = {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,deleteQuestion,likeQuestion,undoLikeQuestion};