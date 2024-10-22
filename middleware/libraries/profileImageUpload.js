const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

const storage = multer.diskStorage({
    //nereye kaydedeceğin burda
    destination : function(req,file,cb){
        const rootDir = path.dirname(require.main.filename);// main dosyanın dir namesini veriyor
        cb(null,path.join(rootDir,"/public/uploads"))
    },
    filename : function(req,file,cb){
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_"+req.user.id+"."+extension;
        cb(null,req.savedProfileImage);
    }
})
const fileFilter = (req,file,cb)=>{
    let allowedMimeTypes = ["image/jpg","image/gif","image/png","image/jpeg"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError(400,"lütfen düzgün dosya  at aq"),false);
    }
    return cb(null,true);
}
const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;