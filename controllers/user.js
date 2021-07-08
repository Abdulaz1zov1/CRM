const User = require('../models/auth');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp')
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

/**
      description: Registration
      POST - api/user/register
 **/
exports.register = asyncHandler(async (req, res) => {
    const salt = await bcrypt.genSaltSync(12);
    const password = await bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role
    })
    await user.save()
        .then(() => {
            res.redirect('/api/user/all')
            console.log(user)
        })
        .catch((error) => {
            res.render('./error/400', { title: '400' })
            console.log(error)
        })
})
/**
      description: Get all user
      GET - api/user/all
 **/
exports.getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.find(
        {
            role: {
                $in: ["student", "teacher"]
            }
        }
    )
        .sort({ date: -1 })
        .select({ name: 1, photo: 1, role: 1, email: 1 })
        
   
    //res.send(user)
    res.render('./user/usersLIST', { title: 'Admin', layout: './layouts', user: user })
    console.log('user: ',user)


})

/**
      description: Login
      POST - api/user/login
 **/
exports.loginSystem = async (req, res) => {
    await User.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            res.send(error)
        } else {
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: 'User not found'
                })
            } else {
                if (!bcrypt.compare(req.body.password, user.password)) {
                    res.status(401).json({
                        success: false,
                        data: 'Invalid password'
                    })

                } else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, config.JWT_SECRET)
                    res.status(200).json({
                        token
                    })
                }

            }
        }
    })
};

/**
      description: Get me
      GET - api/user/me  (Take login system token and then send user's token from Headers)
 ***/
exports.getMe = asyncHandler(async (req, res) => {
    const token = req.headers.authorization
    const user = jwt.decode(token.slice(7, token.length))
    const me = await User.findOne({ _id: user.subject })
        .select({ password: 0 })
    res.send(me)
})

/**
      description: Get user by id
      GET - api/user/:id
 **/
exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        res.render('./error/404', { title: '404' })
    }
    res.render('./user/editForm', { title: 'Admin', layout: './layouts', user: user })
    //console.log(user);
})

/**
      description: Edit user by id
      PUT - api/user/:id
 **/
exports.editUser = async (req, res) => {
    const user = await User.findByIdAndUpdate({ _id: req.params.id });
    if (!user) {
        res.status(404).json({
            success: false,
            data: 'User not found'
        })
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = req.body.role;



    await user.save()
        .then(() => {
            res.redirect('/')
        })
        .catch((error) => {
            res.render('./error/404', { title: '404' })
            console.log(error);
        })
}
/**
      description: Update image
      POST - api/user/upload
 **/
exports.updateImage = async (req, res) => {
    await User.findById({ _id: req.body.id })
        .exec(async (error, user) => {
            if (error) {
                res.send(error)
            } else {
                if (!user.photo == null) {
                    const filePath = path.join(path.dirname(__dirname) + user.photo)
                    fs.unlink(filePath, async (error) => {
                        if (error) throw error;
                    })
                }
                let COMPRESSED_file = path.join(__dirname, `../public/uploads/user`, md5(new Date().getTime()) + '.jpg')
                await sharp(req.file.path).resize(50, 50).jpeg({
                    quality: 60
                }).toFile(COMPRESSED_file, (error) => {
                    if (error) {
                        throw error;
                    }
                    fs.unlink(req.file.path, async (error) => {
                        if (error) res.send(error);
                    })
                })
                user.photo = path.basename(COMPRESSED_file)

                await user.save()
                    .then(() => {
                        //res.send('success')
                        res.render('./user/usersLIST', { title: 'Users', layout: './layouts', user: user.photo })
                        //console.log(user)
                    })
                    .catch((error) => {
                        error
                    })
            }
        })
}
/**
    description: Forget password
    POST - api/user/forgetpassword
 **/
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(404).json({
            success: false,
            data: 'User not found'
        })
    }
    // GET TOKEN
    const resetToken = user.getResetPasswordToken();
    console.log(`This is ResetToken: ${resetToken}`)
    await user.save({ validateBeforeSave: false })
    // create reset URL
    const resetUrl = `${req.protocol}://amediatv.uz/resetpassword/${resetToken}`;
    const msg = {
        to: req.body.email,
        subject: 'Parolni tiklash manzili',
        html: `Parolini tiklash uchun ushbu tugmani bosing  <a type="button" href="${resetUrl}" style="cursor: pointer;background-color: #eee ">Tugma</a>`
    }
    try {
        await sendEmail(msg)
        res.status(200).json({
            success: true,
            data: 'Email is sent'
        });
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorResponse('Email could not be sent', 500));
    }
})


/**
    description: Set new password and Save in cookie
    POST - api/user/resetpassword/:resettoken
 **/

exports.resetPassword = asyncHandler(async (req, res, next) => {

    //Hashing password
    const salt = await bcrypt.genSaltSync(12);
    const newHashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const user = await User.findOneAndUpdate({
        resetPasswordToken: req.params.resettoken
    });
    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }
    // New password is set and it will be hashed after that
    user.password = newHashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // console.log(user.password);
    await user.save();

    sendTokenResponse(user, 200, res);
})
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJWT();
    const options = {
        expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
}

/**
      description: Delete user by id
      DELETE - api/user/:id
 **/
exports.deleteUser = asyncHandler(async (req, res) => {
    await User.findByIdAndRemove({ _id: req.params.id })
    res.redirect('/api/user/all')
})