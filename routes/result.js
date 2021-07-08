const express=require('express')
const router=express.Router()
const {
    Addresult,
    GetById,
    GetByIdAndDelete,
    GetAll,
    UpdateResult
} = require('../controllers/result')

router.post('/add', Addresult)
router.get('/get/:id',GetById)
router.delete('/delete/:id',GetByIdAndDelete)
router.get('/get/all',GetAll)

router.get('/update/:id',UpdateResult)
module.exports=router
