const Subject = require('../models/subject');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


/**
      description: Adding test
      POST - /test/add
 **/
exports.addSubject = asyncHandler(async (req, res) => {
   const subject = new Subject({
      subject: req.body.subject
   })
   await subject.save()
      .then(() => {
         res.redirect('/subject')
      })

   .catch((error) => { 
      res.render('./error/400', { title: 'Admin', })
      console.log(error)
   })
})
/**
   description: Get all tests
   GET - /test/all
**/
exports.getSubjects = asyncHandler(async (req, res) => {
   const subject = await Subject.find();
   res.render('./subject/subjectLIST', { title: 'Admin', layout: './layouts', subject: subject })
   // res.status(200).json({
   //    success: true,
   //    data: subject
   // })
   console.log('subject: ',subject)
});
/**
   description: Get test by id
   GET - /test/:id
**/
exports.getSubject = asyncHandler(async (req, res) => {
   const subject = await Subject.findById({ _id: req.params.id })
   if (!subject) {
      res.render('./error/404', { title: '404' })
   }
   
   res.render('./subject/add', { title: 'Admin', layout: './layouts', subject: subject })
   
})
/**
   description: Edit test by id
   PUT - /test/:id
**/
exports.editSubject = asyncHandler(async (req, res) => {
   const subject = await Subject.findByIdAndUpdate({ _id: req.params.id });
   if (!subject) {
      res.status(404).json({
         success: false,
         data: 'Test not found'
      })
   }

   subject.subject = req.body.subject;
   await subject.save()
      .then(() => {
         res.render('./subject/menuSubject',  { title: 'Admin', layout: './layouts' })
      })
      .catch((error) => {
         res.render('./error/404', { title: '404' })
      })
})
/**
   description: Delete test by id
   DELETE - /test/:id
**/
exports.deleteSubject = asyncHandler(async (req, res) => {
   await Subject.findByIdAndRemove({ _id: req.params.id })
   res.status(200).json({
      succes: true,
      data: []
   })
})