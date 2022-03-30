const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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





module.exports = mongoose.model('Feedback', FeedbackSchema);
