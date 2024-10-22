const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next)=>{
    let customerror = err;
    res.status(customerror.status||500).json({
        success : false,
        message : customerror.message
    })
}
module.exports = customErrorHandler;