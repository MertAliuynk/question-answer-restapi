const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./question");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type : String,
        required : [true,"ismini gir la"]
    },
    email : {
        type : String,
        required : [true,"mailini gir la"],
        uniqure : true,
        math : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"lütfen emialinizin doğru formatta olduğundan emin olun"]
    },
    password : {
        type : String,
        required : [true,"şifreni gir la"]
    },
    profile_image : {
        type : String,
        default :"default.jpg"
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","admin"]
    },
    blocked : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
});
UserSchema.pre("save",function(next){
    if(!this.isModified("password")){
        next()
    }
    user = this;
    bcrypt.hash(user.password , 10 , (err,hash)=>{
        this.password = hash;
        next()
    })
});
UserSchema.post("findOneAndDelete",async function(doc){
    await Question.deleteMany({
        user : doc._id
    })
})
UserSchema.methods.generateJwtFromUser= function() {
    const {JWT_EXPIRE,JWT_SECRET_KEY} = process.env;
    const payload = {
        id : this.id,
        name : this.name
    }
    const token = jwt.sign(payload,JWT_SECRET_KEY ,{
        expiresIn : JWT_EXPIRE
    })
    return token;
}
UserSchema.methods.getResetPasswordTokenFromUser= function(){
    const {RESET_PASSWORD_EXPIRE} = process.env;
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = new Date(Date.now()+Number(RESET_PASSWORD_EXPIRE));
    return resetPasswordToken;
};
module.exports = mongoose.model("User",UserSchema);