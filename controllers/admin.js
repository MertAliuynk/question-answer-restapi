const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User");

const blockUser = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    user.blocked = !user.blocked;
    await user.save();
    return res.status(200).json({success:true});
})
const deleteUser = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.params;
    const user = await User.findOneAndDelete({ _id: id });
    res.status(200).json({
        success: true
    })
})

module.exports = { blockUser,deleteUser};