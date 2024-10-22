const asyncErrorWrapper = require("express-async-handler");
const User = require("../models/User");
const{validateUserInput,comparePassword} = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const sendJwtToClient = require("../helpers/authorization/tokenHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const Login = asyncErrorWrapper(async(req,res,next)=>{
    const { email ,password} = req.body;
    if(!validateUserInput(email,password)){
        return next(new CustomError(400,"bilgilerini tam gir"));
    }
    const user = await User.findOne({email}).select("password");
    if(!comparePassword(password,user.password)){
        return next(new CustomError(400,"şifre yanlış"));
    }
    sendJwtToClient(user,res);
})
const Register = asyncErrorWrapper(async(req,res,next)=>{
    const {name ,email,password,role}=req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendJwtToClient(user,res);
})

const deneme = (req,res,next)=>{
    res.status(200).json({
        success :true
    })
}
const logout = asyncErrorWrapper(async(req,res,next)=>{
    res.status(200).cookie("authorization","",{
        expires : new Date(Date.now())
    })
    .json({
        success : true, 
        message : "işlem başarılı"
    })
})
const imageUpload = asyncErrorWrapper(async(req,res,next)=>{
    //Image Upload Success
    const user =   await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    });
    res.status(200).json({
        success : true,
        data : user
    });
});
const forgotPassword = asyncErrorWrapper(async(req,res,next)=>{
    const resetEmail = req.body.email;
    const user = await User.findOne({email : resetEmail});
    if(!user){
        return next(new CustomError(400,"bu emailde kullanıcı yok"));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();
    
    const resetPasswordUrl =`http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
    <h3> Reset Your Password </h3>
    <p> This <a href = "${resetPasswordUrl}" target ="_blank">link</a> will expire in 1 hour </p> 
    `;
    try{
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Password",
            html : emailTemplate
        });
        res.status(200).json({success: true});
    }
    catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new CustomError(500,"hata"));
    }

})
const resetPassword = asyncErrorWrapper(async(req,res,next)=>{
    const {resetPasswordToken} = req.query;
    const {password} = req.body;
    if(!resetPasswordToken){
        return next(new CustomError(400,"token yok"));
    }
    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });
    if(!user){
        return next(new CustomError(400,"user gelmedi"));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({success:true});
})
const editDetails = asyncErrorWrapper(async(req,res,next)=>{
    const {id} = req.user;
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(id,{
        ...editInformation
    },{
        new :true,
        runValidators : true
    });
    res.status(200).json({
        success : true,
        data: user
    });
})
module.exports = {deneme,Register,Login,logout,imageUpload,forgotPassword,resetPassword,editDetails};