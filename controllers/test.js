const Test = require('../models/test');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


/**
      description: Adding test
      POST - /test/add
 **/ 
exports.addTest = asyncHandler(async (req, res) => {
    const test = new Test({
        subjectID: req.body.subjectID,
        question: req.body.question,
        answer: req.body.answer
    })
    await test.save()
    .then(() => {
        res.status(200).json({
            success: true,
            data: test
        })
    })
    .catch((error) => {
        res.status(400).json({
            success: false,
            error: error
        })

    })
})
/**
      description: Get all tests
      GET - /test/all
 **/
exports.getTests = asyncHandler( async (req , res ) => {
    const test = await Test.find();
    res.status(200).json({
        success: true,
        count: test.length,
        data: test
    });
});
/**
      description: Get test by id
      GET - /test/:id
 **/
exports.getTest = asyncHandler(async (req, res) =>{
    const test = await Test.findById({_id: req.params.id})
    if(!test){
        res.status(404).json({
            success: false,
            data: 'Test not found'
        })
    }
    res.status(200).json({
        success: true,
        data: test
    })
})
/**
      description: Edit test by id
      PUT - /test/:id
 **/
exports.editTest = asyncHandler (async(req,res) => {
    const test = await Test.findByIdAndUpdate({_id: req.params.id});
    if (!test) {
        res.status(404).json({
            success: false,
            data: 'Test not found'
        })
    }
    test.subjectID = req.body.subjectID;
    test.question = req.body.question;
    test.answer = req.body.answer;

    await test.save()
        .then(() => {
            res.status(200).json({success: true, data: test})
        })
        .catch((error) => {
            res.status(200).json({success: false, error: error})
        })
})
/**
      description: Delete test by id
      DELETE - /test/:id
 **/
exports.deleteTest = asyncHandler(async (req,res)=> {
    await Test.findByIdAndRemove({_id: req.params.id})
    res.status(200).json({
        succes: true,
        data: []
    })
})