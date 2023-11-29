const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    roles : [{
        type : String,
        default : "Blogger"
    }],

    active : {
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model('User',UserSchema);