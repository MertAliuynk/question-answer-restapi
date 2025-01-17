const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");

const getSingleUser = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    res.status(200)
    .json({
        success : true,
        data : user
    });
})
const getAllUsers = asyncErrorWrapper(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json(res.queryResult);
})
module.exports = {getSingleUser,getAllUsers};