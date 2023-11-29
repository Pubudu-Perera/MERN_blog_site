const mongoose=require('mongoose')

const CommentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    post:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Post'
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{timestamps:true})

module.exports=mongoose.model("Comment",CommentSchema);