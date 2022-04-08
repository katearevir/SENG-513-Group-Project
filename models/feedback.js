const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');

const FeedbackSchema = new Schema({
    feedback_id: {
        type: Number,
       // required: true,
        index: true
    },
    from_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: false,
    },
    // comment: {message: String, date: Date, hidden: Boolean},

    rating: { //stars out of 5
        type: Number, //might change depending on how starts is implemented
        required: false,
    },
    comment_votes: { //upvotes/downvotes on that comment
        type: Number,
        required: true,
    },
    keywords: {
        type: Array
    },

    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    }
    //need to have a link to the course this feedback is being provided for 
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
