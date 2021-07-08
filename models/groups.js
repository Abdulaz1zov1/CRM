const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subjectID: {
        type : mongoose.Schema.ObjectId,
        ref: 'Subject',
        required : true
    },
    teacherID:{
        type : mongoose.Schema.ObjectId,
        ref: 'Users',
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }

})

GroupSchema.pre('delete', async function(next){
    let group = await this.model.findByIdAndDelete({ _id: req.params.id })
    await group.save()
    next()
    

}) 


const Group = mongoose.model('Group' , GroupSchema);
module.exports = Group;