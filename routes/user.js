const express = require('express');
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const {protect, authorize} = require('../middleware/auth');
const {
    register,
    getAllUsers,
    loginSystem,
    getMe,
    getUser,
    editUser,
    deleteUser,
    updateImage,
    forgotPassword,
    resetPassword
    
} = require('../controllers/user');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/user')
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage })
 
router.post('/register', register)
router.get('/all', getAllUsers)
router.post('/login', loginSystem)
router.get('/me', getMe)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', editUser)
router.post('/upload',upload.single('photo'), updateImage)
router.post('/forgetpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)


module.exports = router
/**
 Protect/Authorize - qo'yilishi kerak:

============== Admin / Moderator ==============
---> 'protect,authorize('admin','moderator')' <---
 => register
 => getUsers
 => editUser
 => deleteUser

 --- 'protect' ---
=> me
 **/
