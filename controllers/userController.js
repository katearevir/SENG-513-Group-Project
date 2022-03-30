let userModel = require("../models/user.js");

let UserQueries = {
    getAllComments: async (req,res) => {
        let foundUser = await userModel.find({name: req.params.username}).populate("messages");
        res.json(foundUser);
    }

}

module.exports = UserQueries;