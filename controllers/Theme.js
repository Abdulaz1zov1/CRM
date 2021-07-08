const Theme = require('../models/Theme')

exports.AddTheme = async (req, res) => {
    
    const theme = new Theme({
        name:req.body.name,
        subjectID:req.body.subjectID,
        video: req.body.video,
        description: req.body.description
    })
    await theme.save()
        .then(()=>{
            res.status(201).json({
                success:true,
                theme:theme
            })
        })
        .catch((error) => {
            res.status(400).json({
                success:false,
                date:error
            })
        })
}

exports.GetAll = async(req,res)=>{
    const theme = await Theme.find()
    res.status(200).json({
        success:true,
        theme:theme
    })
    // console.log(theme)
}



exports.GetById=async (req,res,next)=>{
    const theme= await Theme.findById(req.params.id)
        .select('name')
    res.status(200).json({
        theme
    })
}
exports.GetByIdAndDelete = async (req,res,next)=>{
    await Theme.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        data: []
    })
}

exports.UpdateTheme=async (req,res)=>{
    const theme = await Theme.findByIdAndUpdate(req.params.id)
    theme.name = req.body.name
    theme.subject = req.body.subject
    theme.video = req.body.video
    theme.description = req.body.description
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

