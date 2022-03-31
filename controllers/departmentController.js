let departmentModel = require("../models/department.js");

let DepartmentQueries = {
    //find a specific department
    findDepartment: async (req, res) => {
        let departmentFound = await departmentModel.find({department: req.params.departmentName});
        res.json(departmentFound);
    },
    
    //find all departments
    allDepartments: async (req, res) => {
        let allDepartmentsList = await departmentModel.find();
        res.json(allDepartmentsList);
    },

    //create new departments? may use different method depending on if this actually works
    createDepartments: async(req,res) => {
        let newDepartment = new departmentModel(req.body);
        let savedDepartment = await newDepartment.save();
        res.json(savedDepartment);
    },

    //find all the courses for a specific department
    getAllCoursesForDepartment: async (req,res) => {
        let foundDepartment = await departmentModel.find({department: req.params.departmentName}).populate("courses");
        res.json(foundDepartment);
    }

}

module.exports = DepartmentQueries;