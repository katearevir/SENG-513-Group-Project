let userModel = require("../models/user.js");

let UserQueries = {
    //find a specific user
    findUser: async (req, res) => {
        let userFound = await userModel.find({email: req.params.email});
        res.json(userFound);
    },
    
    //find all users
    allUsers: async (req, res) => {
        let allUsersList = await userModel.find();
        res.json(allUsersList);
    },

    //create new user? may use different method depending on if this actually works
    createUsers: async(req,res) => {
        let newUser = new userModel(req.body);
        let savedUser = await newUser.save();
        res.json(savedUser);
    },


    //find all the comments for a specific user
    getAllCommentsFromUser: async (req,res) => {
        let foundUser = await userModel.find({email: req.params.email}).populate("messages");
        res.json(foundUser);
    }

}

module.exports = UserQueries;