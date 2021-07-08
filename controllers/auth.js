const crypto = require('crypto');
const JWT = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail');
const User = require('../models/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcrypt')
const config = require('../config/config')


/**
      description: Registration
      POST - /api/auth/register
 **/
exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role } = req.body;

    let auth = await User.create({
        name,
        email,
        password,
        role
    });
    res.status(201).json({ success: true, auth: auth });
});
/**
      description: Update image
      POST - api/auth/upload
 **/
exports.updateImage = async (req, res) => {
    await User.findById({ _id: req.body.id })
        .exec(async (error, auth) => {
            if (error) {
                res.send(error)
            } else {
                if (!auth.photo == null) {
                    const filePath = path.join(path.dirname(__dirname) + auth.photo)
                    fs.unlink(filePath, async (error) => {
                        if (error) throw error;
                    })
                }
                let COMPRESSED_file = path.join(__dirname, `../public/uploads/admin`, md5(new Date().getTime()) + '.jpg')
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
                auth.photo = path.basename(COMPRESSED_file)

                await auth.save()
                    .then(() => {
                        //res.send('success')
                        res.render('./admin/authLIST', { title: 'Admin', layout: './layouts', auth: auth.photo })
                        //console.log(user)
                    })
                    .catch((error) => {
                        error
                    })
            }
        })
}


/**
      description: Get Auth
      GET - /api/auth/all
 **/
exports.getAuth = asyncHandler(async (req, res) => {
    const auth = await User.find(
        {
            role: {
                $in: ["admin", "moderator"]
            }
        }
    )
        .sort({ date: -1 })
        .select({ name: 1, photo: 1, role: 1, email: 1 })
    res.render('./admin/authLIST', { title: 'Admin', layout: './layouts', auth })
    console.log('auth: ',auth)
});
/**
      description: Get auth by id
      GET - /api/auth/:id
 **/
exports.getByIdAuth = asyncHandler(async (req, res) => {
    const auth = await User.findById({ _id: req.params.id })
    if (!auth) {
        res.status(404).json({
            success: false,
            data: 'auth not found'
        })
    }
    res.status(200).json({
        success: true,
        auth: auth
    })
})
/**
      description: Edit auth by id
      PUT - /api/auth/:id
 **/
exports.editAuth = asyncHandler(async (req, res) => {
    const auth = await User.findByIdAndUpdate({ _id: req.params.id });
    if (!auth) {
        res.status(404).json({
            success: false,
            auth: 'auth not found'
        })
    }
    auth.subjectID = req.body.subjectID;
    auth.question = req.body.question;
    auth.answer = req.body.answer;

    await auth.save()
        .then(() => {
            res.status(200).json({ success: true, auth: auth })
        })
        .catch((error) => {
            res.status(200).json({ success: false, error: error })
        })
})
/**
      description: Delete auth by id
      DELETE - /api/auth/:id
 **/
exports.deleteTest = asyncHandler(async (req, res) => {
    await User.findByIdAndRemove({ _id: req.params.id })
    res.status(200).json({
        succes: true,
        data: []
    })
})










/**
      description: Login
      POST - /api/auth/login
 **/
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        //return next(new ErrorResponse('Please provide email and password', 400));
        res.render('./admin/login', { title: 'Admin', layout: './admin/layout' })
    }
    // check for user
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
        // return next(new ErrorResponse('Invalid credentials ', 401));
        res.render('./admin/login', { title: 'Admin', layout: './admin/layout' })
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        // return next(new ErrorResponse('Invalid credentials ', 401));
        res.render('./admin/login', { title: 'Admin', layout: './admin/layout' })
    }
    // sendTokenResponse(user, 200, res);

    res.redirect('/dashboard')
});

/**
      description: Read token's info
      POST - /api/auth/me
 **/
exports.getMe = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    const my = JWT.decode(token.slice(7, token.length))
    const user = await User.findById({ _id: my.id })
    res.status(201).json({ success: true, data: user });

});

/**
      description: update current logged user details
      PUT - /api/auth/updatedetails
 **/
exports.UpdateDetails = asyncHandler(async (req, res, next) => {
    const FieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        tel: "+998" + req.body.tel
    }
    const user = await User.findByIdAndUpdate(req.user.id, FieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(201).json({ success: true, data: user });
});

/**
      description: update current logged user details
      PUT - /api/auth/updatepassword
 **/

exports.UpdatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});

/**
      description: Forget password
      POST - /api/auth/forgotpassword
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
    }; try {
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
      description: Reset password
      PUT - /api/auth/forgotpassword
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
// Get token from model , create cookie and send response
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




