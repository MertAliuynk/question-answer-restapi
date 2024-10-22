const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const QuestionSchema = new Schema({
    title : {
        type : String,
        required : [true,"title gir"],
        minlength : [10,"başlık çok kısa"],
        unique : true
    },
    content : {
        type : String,
        required : [true,"content gir"],
        minlength : [20,"content kısa"],
    },
    slug : String,
    creadeAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    likes : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    answers :[
        {
            type : mongoose.Schema.ObjectId,
            ref : "Answer"
        }
    ],
    likecount : {
        type:String,
        default : 0
    },
    answercount : {
        type:String,
        default : 0
    }
})
QuestionSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});
QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-',  
        remove: /[*+~.()'"!:@]/g, 
        lower: true, 
      });
};
module.exports = mongoose.model("Question",QuestionSchema);