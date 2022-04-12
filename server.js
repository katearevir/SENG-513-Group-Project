const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
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

const mongoose = require('mongoose');
// TODO: move to .env
const mongoDB = process.env.MONGO_URI || 'mongodb+srv://ahfhafh:jEYduRc7cZmHExJ@cluster0.3cy1i.mongodb.net/users-database?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(() => {
    console.log("Mongoose connected");
}).catch((err) => console.log(err));

const UserModel = require('./models/user');
const CourseModel = require('./models/course');
const DepartmentModel = require('./models/department');
const FeedbackModel = require('./models/feedback');

const { checkUser } = require('./middleware/authMiddleware');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('*', checkUser);
app.use(indexRouter);
app.use(loginRouter);
app.use(registerRouter);
app.use(addCourseRouter);
app.use(modifyCoursesRouter);
app.use(reviewRouter);
app.use(userPageRouter);
app.use(userPageCommentsRouter);
app.use(courseCommentsRouter);
app.use(addDepartmentRouter);

// TODO: move to .env
const JWT_SECRET = "cat";

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
        console.log("Wrong email or password");
        return res.json({ status: 'error', error: 'Wrong email or password' });
    } else if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "24h" });
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
    const user = await new UserModel({ email: email, password: password, isAdmin: false });
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

// adds course to Courses and new department if it doesn't exist yet
app.post('/api/addCourse', async (req, res) => {
    const { courseName, courseDescription } = req.body;
    let departmentName = courseName.replace(/[^A-Za-z]/g, '').toUpperCase();
    let courseLevel = courseName.replace(/[^0-9]/g, '').slice(0, -2) + '00';
    let findDepartment = await DepartmentModel.findOne({ department: departmentName }).lean();
    var course;
    if (!findDepartment) {
        const newDepartment = await new DepartmentModel({ department: departmentName });
        course = await new CourseModel({ course: courseName, level: courseLevel, description: courseDescription, department: newDepartment._id });
        newDepartment.save((err) => {
            if (err) {
                console.log(err);
                return res.json({ status: 'error', error: err });
            }
            console.log("Department registered");
        });

    } else {
        course = await new CourseModel({ course: courseName, level: courseLevel, description: courseDescription, department: findDepartment._id });
    }

    try {
        await DepartmentModel.updateOne({ department: departmentName }, { "$push": { courses: course } });
    } catch (err) {
        return res.json({ status: 'error', error: err });
    }

    course.save((err) => {
        if (err) {
            if (err.code === 11000) {
                console.log("This course already exists");
                return res.json({ status: 'error', error: 'This course already exists' });
            } else {
                console.log(err);
                return res.json({ status: 'error', error: err });
            }
        }
        console.log("Course registered");
    });
    res.json({ status: 'ok' });
});

// adds department to Departments 
app.post('/api/addDepartment', async (req, res) => {
    const { departmentNameToAdd } = req.body;
    let departmentName = departmentNameToAdd.replace(/[^A-Za-z]/g, '').toUpperCase();
    let findDepartment = await DepartmentModel.findOne({ department: departmentName }).lean();
    var course;
    if (!findDepartment) {
        const newDepartment = await new DepartmentModel({ department: departmentName });
        newDepartment.save((err) => {
            if (err) {
                console.log(err);
                return res.json({ status: 'error', error: err });
            }
            console.log("Department registered");
        });
    } else {
        console.log("Department has previously been registered");
    }
    res.json({ status: 'ok' });
});

app.post('/api/addReview', checkUser, async (req, res) => {
    const { rating, comment, keywordArr, courseName } = req.body;
    const course = await CourseModel.findOne({ course: courseName });
    const feedback = await new FeedbackModel({ from_user: res.locals.user?.id, comment: comment, rating: rating, comment_votes: 0, keywords: keywordArr, course: course._id });
    feedback.save((err) => {
        if (err) {
            console.log(err);
            return res.json({ status: 'error', error: err });
        }
        console.log("Review added");
    });

    try {
        await CourseModel.updateOne({ course: courseName }, { "$push": { messages: feedback } });
        await UserModel.updateOne({ _id: res.locals.user.id }, { "$push": { messages: feedback } });
    } catch (err) {
        return res.json({ status: 'error', error: err });
    }

    res.json({ status: 'ok' });
});

app.post('/api/upvote', (req, res) => {
    const { reviewID } = req.body;
    FeedbackModel.updateOne({ _id: reviewID }, { "$inc": { comment_votes: 1 } }, (err, result) => {
        if (err) throw err;
        else if (result) {
            return res.json({ status: 'ok' });
        } else {
            console.log('Could not find course')
            return res.json({ status: 'error', error: "Could not find course" });
        }
    })
});

app.post('/api/downvote', (req, res) => {
    const { reviewID } = req.body;
    FeedbackModel.updateOne({ _id: reviewID }, { "$inc": { comment_votes: -1 } }, (err, result) => {
        if (err) throw err;
        else if (result) {
            return res.json({ status: 'ok' });
        } else {
            console.log('Could not find course')
            return res.json({ status: 'error', error: "Could not find course" });
        }
    })
});

app.delete('/api/deleteCourse', (req, res) => {
    const { courseName } = req.body;
    CourseModel.deleteOne({ course: courseName }, (err, result) => {
        if (err) throw err;
        else if (result) {
            return res.json({ status: 'ok' });
        } else {
            console.log('Could not find course')
            return res.json({ status: 'error', error: "Could not find course" });
        }
    });
});

app.post('/api/getCourseInfo_modify', (req, res) => {
    const { courseSearch } = req.body;
    CourseModel.findOne({ course: courseSearch }, (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ status: 'error', error: err });
        } else if (result) {
            return res.json({ status: 'ok', data: result });
        } else {
            console.log("can't find course");
            return res.json({ status: 'error', error: "can't find course" });
        }
    });
});

app.post('/api/modifyCourse', (req, res) => {
    const { courseSearch, updated_textarea } = req.body;
    CourseModel.updateOne({ course: courseSearch }, { "$set": { description: updated_textarea } }, (err, result) => {
        if (err) throw err;
        else if (result) {
            return res.json({ status: 'ok' });
        } else {
            console.log('Could not find course')
            return res.json({ status: 'error', error: "Could not find course" });
        }
    });
});

app.post('/api/deleteRating', (req, res) => {
    const { reviewID } = req.body;
    FeedbackModel.deleteOne({ _id: reviewID }, (err, result) => {
        if (err) throw err;
        else if (result) {
            return res.json({ status: 'ok' });
        } else {
            console.log('Could not find review')
            return res.json({ status: 'error', error: "Could not find review" });
        }
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});