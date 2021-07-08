const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    userID:{
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    subjectID:{
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    groupID:{
        type : mongoose.Schema.ObjectId,
        ref:'Group',
        required: true
    },
    ball:{
        type: Number,
        required: true
    },
    info:{
        type: String,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now()
    }
})
module.exports=mongoose.model('result',resultSchema)
