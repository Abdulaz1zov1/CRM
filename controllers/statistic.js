const Subject = require('../models/subject')
const Test = require('../models/test')
const Group = require('../models/groups')
const User = require('../models/auth')


exports.getStatistics = async (req, res) => {

 const subject = await Subject.find().countDocuments()
 const test = await Test.find().countDocuments()
 const group = await Group.find().countDocuments()
 const user = await User.find().countDocuments()
 
 res.render('./statistic/statistic', { 
  title: 'Admin',
  layout: './layouts', 
  subject, test, group, user
 })
}
