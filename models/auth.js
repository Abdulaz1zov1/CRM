const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const config = require('../config/config')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Iltimos ismingizni kiriting'],
        trim: true
    },
    email : {
        type : String,
        required : [true , 'Iltimos pochtangizni kiriting'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , 'Iltimos pochtangizni tekshiring'],
        unique : [true , `Bu pochta allaqachon registratsiyadan o'than`],
        trim: true,
    },
    password : {
        type : String,
        required : [true , 'Iltimos parolni kiriting'],
        trim: true,
        select: false
    },
    tel : {
        type : Number,
        maxlength : 9
    },
    role : {
        type : String,
        enum : ['student', 'teacher', 'moderator', 'admin'],
        default: 'student'
    },
    photo: {
        type : String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    date : {
        type : Date,
        default : Date.now()
    }
});

// Encrypt password using bcrypt
userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});
// Sign JWT and return
userSchema.methods.getSignedJWT = function() {
    return JWT.sign({ id: this._id } , config.JWT_SECRET , {
        expiresIn: config.JWT_EXPIRE
    });
}

//  Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare( enteredPassword, this.password);
}

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10*60*1000;
    return resetToken;
}
const User = mongoose.model('Users' , userSchema);
module.exports = User;
