const ThirdModel = require('../models/ThirdModel')

exports.addThirdGroup = async (req, res) => {
    const thirdmodel = new ThirdModel({
        groupID: req.body.groupID,
        userID: req.body.userID


    })
    await thirdmodel.save()
        .then(() => {
            res.redirect('/group/student')
            alert(`Talaba qo'shildi`)
        })
        .catch((error) => {
            res.status(400), json({
                success: true,
                error: error
            })
        })
}
exports.getThirdGroup = async (req, res, next) => {
    const thirdmodel = await ThirdModel.findById(req.params.id)
        .select('name')
    res.status(201).json({
        success: true,
        thirdmodel: thirdmodel
    })
}

exports.deleteThirdGroup = async (req, res, next) => {
    await ThirdModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        thirdmodel: []
    })
}

    exports.getThirdGroups = async (req, res) => {
        const thirdmodel = await ThirdModel.find({ groupID: req.params.id })
            .sort({ date: -1 })
            // .limit(3)
            .populate(
                [
                    { path: 'groupID', select: 'name' },
                    { path: 'userID', select: 'name' }

                ]
            )
        res.status(201).json({
            success: true,
            thirdmodel: thirdmodel
        })

    }

