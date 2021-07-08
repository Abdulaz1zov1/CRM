const mongoose=require('mongoose')
const ThemeSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subjectID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model('Theme',ThemeSchema)
