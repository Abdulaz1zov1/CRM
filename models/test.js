const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
    subjectID: {
        type : mongoose.Schema.ObjectId,
        ref: 'Subject',
        required : true
    },
    question: {
        type: String,
        required:true
    },
    answer: [{
        test: {
            type: String,
            required:true
        },
        status: {
            type: Boolean,
            require: true
        }
    }],
    date : {
        type : Date,
        default : Date.now()
    }
})

const Test = mongoose.model('Test' , TestSchema);
module.exports = Test;