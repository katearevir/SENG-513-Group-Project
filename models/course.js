const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Course', CourseSchema);
