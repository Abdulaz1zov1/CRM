const Group = require('../models/groups');
const User = require('../models/auth');
const Subject = require('../models/subject');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ThirdModel = require('../models/ThirdModel')

/**
      description: Adding groups
      POST - /group/add
 **/


exports.addGroup = asyncHandler ( async (req, res) => {
    const group = new Group({
        name: req.body.name,
        subjectID: req.body.subjectID,
        teacherID: req.body.teacherID
    })
    await group.save()
        .then(() => {
            res.redirect('/dashboard')
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                error: error
            })

        })
})
/**
      description: Get all groups
      GET - /group/all
 **/
exports.getGroups = asyncHandler(async (req, res) => {
    const group = await Group.find()
        .sort({ date: -1 })
        .populate(
            [
                { path: 'teacherID', select: 'name' },
                { path: 'subjectID', select: 'subject' }
            ]
        )
    res.render('./group/groupLIST', { title: 'Admin', layout: './layouts', group: group })
    console.log('group: ', group)
});
exports.getGroup = asyncHandler(async (req, res) => {
    const students = await ThirdModel.find({ groupID: req.params.id })
        .populate(
            { path: 'userID', select: ['name', 'rating', 'date'], sort: { date: -1 } }
        )
    
    const group = await Group.findById(req.params.id)
        .populate([
            { path: 'teacherID', select: 'name' },
            { path: 'subjectID', select: 'subject' }

        ])
    // console.log("students: ", students)
    // console.log("group: ", group)
    res.render('./group/info', { title: 'Admin', layout: './layouts', students: students, group: group })
})
/**
      description: Get group by id
      GET - /group/:id
 **/
exports.getGroupById = asyncHandler(async (req, res) => {
    
})



/**
      description: Edit group by id
      PUT - /group/:id
 **/
exports.editGroup = asyncHandler(async (req, res) => {
    const group = await Group.findByIdAndUpdate({ _id: req.params.id });
    if (!group) {
        res.status(404).json({
            success: false,
            data: 'Group not found'
        })
    }
    group.name = req.body.name;
    group.subjectID = req.body.subjectID;
    group.teacherID = req.body.teacherID;

    await group.save()
        .then(() => {
            res.status(200).json({ success: true, data: group })
        })
        .catch((error) => {
            res.status(200).json({ success: false, error: error })
        })
})
/**
      description: Delete group by id
      DELETE - /group/:id
 **/
exports.deleteGroup = asyncHandler(async (req, res) => {

    // guruhdan studentni o'chirish
    // await Group.findByIdAndDelete(req.params.id)
    // res.status(200).json({ success: true, data: []})

    // guruhdan studentni o'chirish
    await ThirdModel.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/api/group/all')

})


/**
 description:To get individual's ball
 GET - /:id/user/:user/ball
  */
exports.GetBall=asyncHandler(async(req,res)=>{
    const group=await Group.find()
        .select('result')
    res.send(201).json({
        group
    })
})

