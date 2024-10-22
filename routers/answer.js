const express = require("express");
const {verifyToken} = require("../middleware/Authorization/auth");
const {addNewAnswerToQuestion,getAllAnswersToQuestion,getSingleAnswer,editAnswer,deleteAnswer,undoLikeAnswer,likeAnswer} = require("../controllers/answer");
const {checkQuestionAndAnswerExist} = require("../middleware/database/databaseErrorHelpers");
const {getAnswerOwnerAccess} = require("../middleware/Authorization/auth");
const router = express.Router({mergeParams:true});//önceki routerdeki paramsları geçirmesini sağlar

 router.post("/",verifyToken,addNewAnswerToQuestion);
 router.get("/",getAllAnswersToQuestion);
 router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer);
 router.put("/:answer_id/edit",[checkQuestionAndAnswerExist,verifyToken,getAnswerOwnerAccess],editAnswer);
 router.delete("/:answer_id/delete",[checkQuestionAndAnswerExist,verifyToken,getAnswerOwnerAccess],deleteAnswer);
 router.get("/:answer_id/like",[checkQuestionAndAnswerExist,verifyToken],likeAnswer);
 router.get("/:answer_id/undolike",[checkQuestionAndAnswerExist,verifyToken],undoLikeAnswer);

module.exports =router;