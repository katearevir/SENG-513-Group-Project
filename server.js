const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

const loginRouter = require('./routers/loginRouter')

const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://ahfhafh:jEYduRc7cZmHExJ@cluster0.3cy1i.mongodb.net/users-database?retryWrites=true&w=majority';
mongoose.connect(mongoDB).then(() => {
    console.log("Mongoose connected");
}).catch((err) => console.log(err));

const User = require('./models/user')
const Course = require('./models/course')
const Department = require('./models/department')
const Feedback = require('./models/feedback')

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.use('/login', loginRouter);

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('user connection: ' + socket.id);
    socket.on('user_registration', (email, password) => {
        const user = new User({email: email, password: password, isAdmin: false});
        user.save().then(() => {
            console.log("User registered");
        })
    })
})