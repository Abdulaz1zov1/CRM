const express = require('express');
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path'); 
const {protect} = require('../middleware/auth');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    UpdateDetails,
    UpdatePassword,
    getAuth,
    updateImage
      
} = require('../controllers/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/admin')
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage })
  
router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.get('/all', getAuth);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/upload',upload.single('photo'), updateImage)
router.put('/updatedetails', UpdateDetails);
router.put('/updatepassword', UpdatePassword);

/**
 PROTECT qo'yilishi kerak:
 * getME
 * UpdateDetails
 * UpdatePassword
 **/
module.exports =router

