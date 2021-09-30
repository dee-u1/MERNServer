const express =require('express');
const router = express.Router();

const UserModel = require('../../models/UserModel');

// @route GET students
// @desc  Retrieve User with specified username and password
// @access Public
router.get("/", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    let nameOfUser = '';

    UserModel.find({username: username, password: password},function(err, user) {
        if (err) throw err;
        console.log("number of users " + user.length);
        //console.log("user.name", user[0].username);
        nameOfUser = user[0].name;
        console.log("nameOfUser", nameOfUser);
        res.json(nameOfUser); 
    });
  });

module.exports = router;