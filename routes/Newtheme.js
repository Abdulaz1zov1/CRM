const express=require('express')
const router=express.Router()
const {AddTheme,
    GetById,GetByIdAndDelete,
    GetAll,UpdateTheme}=require('../controllers/Newtheme')
router.post('/add',AddTheme)
router.get('/get/:id',GetById)
router.delete('/delete/:id',GetByIdAndDelete)
router.get('/get/all',GetAll)
router.get('/update/:id',UpdateTheme)
module.exports=router
