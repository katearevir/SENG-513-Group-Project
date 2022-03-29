const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Feedback",
        // message: String, 
        // date: Date, 
        // hidden: Boolean
    }]
    // TODO: move messages to separate database
}, {
    timestamps: true
});

const CourseSchema = new Schema({
    course: { 
        type: String, // Example of input structure: DEPT NUM eg. SENG 513. may need to verify somewhere that it is in this format 
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
  
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Feedback"
    }]
    // messages: [{message: String, date: Date, hidden: Boolean}]
    // This might need to be connected to the comments table 
}, {
    timestamps: true
});

const FeedbackSchema = new Schema({
    feedback_id: {
        type: INT,
        required: true,
        index: true
    },
   /*  comment: {
        type: String,
        required: false,
    }, */
    comment: {message: String, date: Date, hidden: Boolean},

    rating: { //stars out of 5
        type: INT, //might change depending on how starts is implemented
        required: false,
    },
    comment_rating: { //upvotes/downvotes on that comment
        type: INT,
        required: true,
    },

    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    }
    //need to have a link to the course this feedback is being provided for 
}, {
    timestamps: true
});

const DepartmentSchema = new Schema({
    department: {
        type: String,
        required: true,
        index: true
    },
   
    //holds the courses that belong to the department from CoursesSchema
    course: [{
        type: Schema.Types.ObjectId,
        ref: "Course"
    }]
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports = mongoose.model('Course', CourseSchema);
module.exports = mongoose.model('Feedback', FeedbackSchema);
module.exports = mongoose.model('Department', DepartmentSchema);