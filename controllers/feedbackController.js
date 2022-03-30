let feedbackModel = require("../models/feedback.js");

let FeedbackQueries = {
    //find a specific feedback. might remove since seems useless
    findFeedback: async (req, res) => {
        let feedbackFound = await feedbackModel.find({feedback_id: req.params.feedback_id});
        res.json(feedbackFound);
    },
    
    //find all feedback
    allFeedback: async (req, res) => {
        let allFeedbackList = await feedbackModel.find();
        res.json(allFeedbackList);
    },

    //create new feedback? may use different method depending on if this actually works
    createFeedback: async(req,res) => {
        let newFeedback = new feedbackModel(req.body);
        let savedFeedback = await newFeedback.save();
        res.json(savedFeedback);
    },


    //find the course linked to this feedback
    getCourseForComment: async (req,res) => {
        let foundCourse = await userModel.find({feedback_id: req.params.email}).populate("course");
        res.json(foundCourse);
    }

}

module.exports = FeedbackQueries;