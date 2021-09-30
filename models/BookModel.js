const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    ISBN: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    edition: {
        type: String,
        required: true
    } ,
    publication: {
        type: String,
        required: true
    } 
    ,
    reservedBy: {
        type: String,
        required: false
    } 
    ,
    IDNum: {
        type: String,
        required: false
    } 
}, { versionKey: false });

module.exports = BookModel = mongoose.model('BookModel', BookSchema, 'books');