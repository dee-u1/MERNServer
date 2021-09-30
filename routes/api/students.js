const express =require('express');
const router = express.Router();

const StudentModel = require('../../models/StudentModel');

// @route GET students
// @desc  Retrieve All Students
// @access Public
router.get("/", async (req, res) =>{
    await StudentModel.find()
        .then(students => res.json({ data: students }))
});

// @route POST students
// @desc  Add A Student
// @access Public
router.post("/", async (req, res) => {
    await StudentModel.create(req.body, function(err, obj) {
        if (err) throw err;
        console.log("1 student added");   
    }); 

    await StudentModel.find({},function(err, students) {
        if (err) throw err;
        console.log("number of students " + students.length);
        res.json({ data: students}); 
    });
});

// @route GET students
// @desc  Check for the existence of username and password
// @access Public
router.get("/checkaccount", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    StudentModel.find({'userName': username, 'password': password},function(err, students) {
        if (err) throw err;
        console.log("number of students " + students.length);
        res.json({ data: students}); 
    });

  });
  

module.exports = router;