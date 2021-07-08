const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

const Subject = mongoose.model('Subject' , SubjectSchema);
module.exports = Subject;