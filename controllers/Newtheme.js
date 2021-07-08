const Theme =require('../models/New Theme')
exports.AddTheme=(req,res)=>{
    const theme=new Theme({
        name:req.body.name,
        subject:req.body.subject,
        video:req.body.video
    })
    theme.save()
        .then(()=>{
            res.status(201).json({
                success:true,
                date:theme
            })
        })
        .catch((error)=>{
                res.status(400).json({
                    success:false,
                    date:error
                })
            }
        )
}
exports.GetById=async (req,res,next)=>{
    const theme= await Theme.findById(req.params.id)
        .select('name')
    res.status(200).json({
        theme
    })
}
exports.GetByIdAndDelete=async (req,res,next)=>{
    const theme= await Theme.findByIdAndDelete(req.params.id)
    res.status(200).json({
        theme
    })
}
exports.GetAll=async(req,res)=>{
    const theme=await Theme
        .find()
    //.sort({date:-1})
    //.limit(3)
    //.select('name')
    res.status(200).json({
        theme
    })
}
exports.UpdateTheme=async (req,res)=>{
    const theme=await Theme.findByIdAndUpdate(req.params.id)
    theme.name=req.body.name,
        theme.subject=req.body.subject,
        theme.video=req.body.video,
        theme.description=req.body.description
    theme.save()
        .then(()=>{
            res.status(201).json({
                theme
            })
        })
        .catch((error)=>{
            res.status(400).json({
                error
            })
        })
}
