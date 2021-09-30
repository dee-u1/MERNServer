const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { urlencoded, json } = require('body-parser');
const app = express();

// app.use( req,res, next => {
//  if (req.headers.authorization === "20210814"){
//    next();
//  }else {
//    res.send(401);
//  }
// });


app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

const booksAPI = require('./routes/api/books');
const studentsAPI = require('./routes/api/students');
const usersAPI = require('./routes/api/users');

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('OK'))
  .catch(err => console.log(err));

app.use('/api/books', booksAPI);
app.use('/api/students', studentsAPI);
app.use('/api/users', usersAPI);

app.listen(8000, () => {
  console.log("Server is running and listening to port 8000");
})