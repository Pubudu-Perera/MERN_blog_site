const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    title : {
        type : String,
        required : true,
        unique : true
    },

    description : {
        type : String,
        required : true,
    },

    photo : {
        type : String,
        required : false,
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },

    categories : {
        type : Array
    }
},
{
    timestamps : true
})

module.exports = mongoose.model('Post',PostSchema);