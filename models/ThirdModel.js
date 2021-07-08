const mongoose = require('mongoose')
const ThirdModel = mongoose.Schema({
  groupID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: true
  },
  // student id
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now()
  }
})

const thirdModel = mongoose.model('ThirdModel' , ThirdModel);
module.exports = thirdModel;
