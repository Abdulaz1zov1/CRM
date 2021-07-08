const Result = require('../models/result')

exports.Addresult=(req,res)=>{
    const result = new Result({
        userID:req.body.userid,
        subjectID:req.body.subject,
        groupID:req.body.group,
        ball:req.body.ball,
        info:req.body.info
    })
    result.save()
        .then(()=>{
            res.status(201).json({
                success:true,
                date:result
            })
        })
        .catch((error)=>{
                res.status(400).json({
                    success:false,
                    error:error
                })
            }
        )
}
exports.GetById=async (req,res,next)=>{
    const result= await Result.findById(req.params.id)
        //.select()
    res.status(200).json({
        result
    })
}
exports.GetByIdAndDelete=async (req,res,next)=>{
    const result= await Result.findByIdAndDelete(req.params.id)
    res.status(200).json({
        result
    })
}
exports.GetAll=async(req,res)=>{
    const result=await Result
        .find()
    //.sort({date:-1})
    //.limit(3)
    //.select()
    res.status(200).json({
        result
    })
}
exports.UpdateResult=async (req,res)=>{
    const result = await Result.findByIdAndUpdate(req.params.id)
    
        result.userID=req.body.userid,
        result.subjectID=req.body.subject,
        result.groupID=req.body.group,
        result.ball=req.body.ball,
        result.info=req.body.info
    result.save()
        .then(()=>{
            res.status(201).json({
                result
            })
        })
        .catch((error)=>{
            res.status(400).json({
                error
            })
        })
}

