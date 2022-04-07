const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const indexRouter = require('./routers/indexRouter')
const loginRouter = require('./routers/loginRouter')
const registerRouter = require('./routers/registerRotuer')
const addCourseRouter = require('./routers/addCourseRouter')
const modifyCoursesRouter = require('./routers/modifyCoursesRouter')
const reviewRouter = require('./routers/reviewRouter')
const userPageCommentsRouter = require('./routers/userPageCommentsRouter')
const userPageRouter = require('./routers/userPageRouter')
const courseCommentsRouter = require('./routers/courseCommentsRouter');
const addDepartmentRouter = require('./routers/addDepartmentRouter');
const courseCommsModRouter = require('./routers/courseCommsModRouter');

const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://ahfhafh:jEYduRc7cZmHExJ@cluster0.3cy1i.mongodb.net/users-database?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(() => {
    console.log("Mongoose connected");
}).catch((err) => console.log(err));
const db = mongoose.connection;

const User = require('./models/user')
const Course = require('./models/course')
const Department = require('./models/department')
const Feedback = require('./models/feedback')

const userQuery = require('./controllers/userController');

const { checkUser } = require('./middleware/authMiddleware')

const { response } = require('express');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('*', checkUser);
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/addCourse', addCourseRouter);
app.use('/modifyCourses', modifyCoursesRouter);
app.use('/review', reviewRouter);
app.use('/userPage', userPageRouter);
app.use('/userPageComments', userPageCommentsRouter);
app.use('/courseComments', courseCommentsRouter);
app.use('/addDepartment', addDepartmentRouter);
app.use('/courseCommsMod', courseCommsModRouter);

// move to .env
const JWT_SECRET = "cat";

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();

    if (!user) {
        console.log("Wrong email or password");
        return res.json({ status: 'error', error: 'Wrong email or password' });
    } else if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin}, JWT_SECRET, { expiresIn: "24h" });
        res.cookie('jwt', token, { httpOnly: true });
        // console.log("Login successful");
        return res.json({ status: 'ok', data: token });
    }

    console.log("Wrong email or password");
    res.json({ status: 'error', error: 'Wrong email or password' });
})

app.post('/api/register', async (req, res) => {
    const { email, password: textPassword } = req.body;
    const password = await bcrypt.hash(textPassword, 5);
    const user = await new User({ email: email, password: password, isAdmin: false });
    user.save((err) => {
        if (err) {
            if (err.code === 11000) {
                console.log("Email has already been registered");
                return res.json({ status: 'error', error: 'Email has already been registered' });
            } else {
                console.log(err);
                return res.json({ status: 'error', error: err });
            }
        }
        console.log("User registered");
        res.json({ status: 'ok' });
    });
})

app.get('/logout', async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// io.on('connection', (socket) => {
//     socket.on('course_creation', (courseName, courseDescription) => {
//         const course = new Course({ course: courseName, description: courseDescription });
//         course.save().then(() => {
//             console.log("Course Created");
//         })
//     });

//     socket.on('department_creation', (departmentName) => {
//         const department = new Department({ department: departmentName });
//         department.save().then(() => {
//             console.log("Department Created");
//         })
//     });
// })
