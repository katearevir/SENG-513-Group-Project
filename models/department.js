const mongoose = require('mongoose');
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
    department: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    //holds the courses that belong to the department from CoursesSchema
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema);