const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

const indexRouter = require('./routers/indexRouter')
const loginRouter = require('./routers/loginRouter')
const registerRouter = require('./routers/registerRotuer')
const addCourseRouter = require('./routers/addCourseRouter')
const moderatorRouter = require('./routers/moderatorRouter')
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
const { response } = require('express');

app.use(express.static('public'));

// app.get('/', (req, res) => {
// res.sendFile(__dirname + '/index.ejs');
// allCoursesList = db.collection('courses').find({}).toArray((err, result) => {
//     if (err) throw err
//     res.send(result);
// })
// });

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/addCourse', addCourseRouter);
app.use('/moderator', moderatorRouter);
app.use('/modifyCourses', modifyCoursesRouter);
app.use('/review', reviewRouter);
app.use('/userPage', userPageRouter);
app.use('/userPageComments', userPageCommentsRouter);
app.use('/courseComments', courseCommentsRouter);
app.use('/addDepartment', addDepartmentRouter);
app.use('/courseCommsMod', courseCommsModRouter);

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('user connection: ' + socket.id);
    socket.on('user_registration', async (email, password) => {
        const user = await new User({ email: email, password: password, isAdmin: false });
        user.save((err) => {
            if (err.code === 11000) {
                console.log("Email has already been registered");
                socket.emit("register_dup");
                return;
            } else {
                console.log("User registered");
                socket.emit("register_success")
            }
        });
    });

    socket.on('user_login', async (email, password) => {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            socket.emit("login_fail");
            console.log("No such user with email exists");
            return;
        } else if (password === user.password) {
            socket.emit("login_success");
            console.log("login success");
        } else {
            socket.emit("login_fail");
            console.log("wrong password")
        }

    })

    socket.on('course_creation', (courseName, courseDescription) => {
        const course = new Course({ course: courseName, description: courseDescription });
        course.save().then(() => {
            console.log("Course Created");
        })
    });

    socket.on('department_creation', (departmentName) => {
        const department = new Department({ department: departmentName });
        department.save().then(() => {
            console.log("Department Created");
        })
    });

    socket.on('review_creation', (ratings, courseComment, keywordArr) => {
        const feedback = new Feedback({ rating: ratings, comment: courseComment, keywords: keywordArr, comment_rating: 0 });
        feedback.save().then(() => {
            console.log("Feedback Created");
        })
    });
})