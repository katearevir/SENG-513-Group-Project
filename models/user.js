const mongoose = require('mongoose');
const { Schema } = mongoose;
const Feedback = require('./feedback');

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
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
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;