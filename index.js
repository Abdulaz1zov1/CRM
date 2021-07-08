const express = require('express')
const cors = require('cors')
const app = express()
const connection = require('./data/mongodb')
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')
const ejs = require('ejs');
const methodOverride = require("method-override");
const Subject = require('./models/subject')
const Group = require('./models/groups')
const User = require('./models/auth')
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

// Import passport
//require('./config/passport')(passport)
// Express-layouts set
app.use(expressLayouts)
// MongoDB connecting
connection();
// Findmistakes
app.use(cors())
// BodyParser Middleware

// Connect  Flash
app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS Static
app.use(express.static('public'));
app.use('/plugins', express.static(__dirname + 'public/plugins'))
app.use('/uploads', express.static(__dirname + 'public/uploads'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/fonts', express.static(__dirname + 'public/fonts'))
app.use('/icon', express.static(__dirname + 'public/icon'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/pages', express.static(__dirname + 'public/pages'))
app.use('/scss', express.static(__dirname + 'public/scss'))
app.use('/scss', express.static(__dirname + 'public/uploads'))
// Set Views 
app.set('views', './views')
app.set('view engine', 'ejs')

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
// Passport middleware
app.use(passport.initialize());
app.use(passport.session())
// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

/* ---------------------------    R O U T E S      --------------------------- */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/group', require('./routes/groups'))
app.use('/api/test', require('./routes/test'))
app.use('/api/subject', require('./routes/subject'))
app.use('/api/statistic', require('./routes/statistic'))

app.use('/api/addStudentGroup', require('./routes/ThirdModel'))
app.use('/api/theme', require('./routes/Theme'))
app.use('/api/newtheme', require('./routes/Newtheme'))
app.use('/api/result', require('./routes/result'))




 



/* ---------------------------    A  P  I      --------------------------- */
/* =========    Dashboard     ========= */
app.get('/', (req, res) => {
    res.render('./admin/login', { title: 'Admin', layout: './admin/layout' })
})
/* =========    Dashboard     ========= */
app.get('/dashboard', (req, res) => {
    res.render('./home/home', { title: 'Admin', layout: './layouts' })
})
/* =========    Fanlar     ========= */
app.get('/subject', (req, res) => {
    res.render('./subject/menuSubject', { title: 'Admin', layout: './layouts' })
})
app.get('/subject/new', (req, res) => {
    res.render('./subject/add', { title: 'Admin', layout: './layouts' })
})
/* =========    Guruhlar     ========= */
app.get('/group', (req, res) => {
    res.render('./group/menuGroup', { title: 'Admin', layout: './layouts' })
})
app.get('/group/add', async (req, res) => {
    const teacherID = await User.find({ role: { $in: ["teacher"] } })
        .select({ name: 1 })

    const subjectID = await Subject.find().select({ subject: 1 })
    res.render('./group/add', { title: 'Admin', layout: './layouts', subjectID, teacherID })
})


/* =========    Guruhga talaba qo'shish     ========= */
app.get('/group/student',async (req, res) => {
    const userID = await User.find({ role: { $in: ["student"] } })
        .select({ name: 1 })

    const groupID = await Group.find()
        .select({ name: 1 })
    
    res.render('./group/addStudent', { title: 'Admin', layout: './layouts', userID, groupID })
})

/* =========    User     ========= */
app.get('/api/user/add', (req, res) => {
    res.render('./user/userForm', { title: 'Admin', layout: './layouts' })
})


/* =========  Settings [ all, edit, delete ]  ========== */
app.get('/setting', (req, res) => {
    res.render('./setting/setting', { title: 'Admin', layout: './layouts' })
}) 













// listening server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})