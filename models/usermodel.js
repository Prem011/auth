const mongoose = require('mongoose');
const { type } = require('os');
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    
    username : {
        type : 'String',
        required : [true, "username is required"],
        trim : true,
        unique : true,
        minlength : [4, "username must be of length 4"],
    },

    name : {
        type : 'String',
        // required : [true, "Name is required"],
        trim : true,
        minlength : [4, "fullname must be of length 4"],
        // maxlength : 255
    },

    email : {
        type : 'String',
        required : [true, "Name is required"],
        trim : true,
        unique : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : "String",
    profileImage : {
        type : "String",
        default : "default.jpg"
    }
},
  {
        timestamps : true
    }
)

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema)
module.exports = User; 