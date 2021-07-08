const express=require('express')
const router=express.Router()
const {
    AddTheme,
    GetAll,
    GetById,
    GetByIdAndDelete,
    UpdateTheme
} = require('../controllers/Theme')


router.post('/add', AddTheme)
router.get('/all',GetAll)
router.get('/:id',GetById)
router.delete('/:id',GetByIdAndDelete)
router.get('/:id', UpdateTheme)

module.exports=router
