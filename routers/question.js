const express = require("express");
const {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,deleteQuestion,likeQuestion,undoLikeQuestion} = require("../controllers/question");
const {verifyToken, getQuestionOwnerAccess}=require("../middleware/Authorization/auth");
const { checkQuestionExist } = require("../middleware/database/databaseErrorHelpers");
const answer = require("./answer");
const questionQueryMiddleware = require("../middleware/query/questionQueryMiddleware");
const Question = require("../models/question");
const answerQueryMiddleware = require("../middleware/query/answerQueryMiddleware");

const router = express.Router();

router.get("/:id/undolike",[verifyToken,checkQuestionExist],undoLikeQuestion);
router.get("/:id/like",[verifyToken,checkQuestionExist],likeQuestion);
router.post("/ask",verifyToken,askNewQuestion);

router.get("/",
    questionQueryMiddleware(Question,{
        population : {
            path : "user",
            select : "name , profile_image"
        }
    }),getAllQuestions);

router.get("/:id",[checkQuestionExist],answerQueryMiddleware(Question,{
    population : [
        {
            path : "answers",
            select :"content"
        },
        {
            path : "user",
            select :"name profile_image"
        }
    ]
}),getSingleQuestion);
router.put("/:id/edit",[verifyToken,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
router.delete("/:id/delete",[verifyToken,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);
router.use("/:question_id/answers",checkQuestionExist,answer);//req.paramsdaki id expressin doğası gereği alt routere geçmez burda answere geçmiyor
module.exports = router;