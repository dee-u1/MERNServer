const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    IDNum: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    } ,
    password: {
        type: String,
        required: true
    } 
}, { versionKey: false });

module.exports = StudentModel = mongoose.model('StudentModel', StudentSchema, 'students');