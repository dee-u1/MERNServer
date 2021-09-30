const express = require('express');
const router = express.Router();

const BookModel = require('../../models/BookModel');

// @route GET books
// @desc  Get All Books
// @access Public
router.get("/", (req, res) =>{
    BookModel.find()
      .then(liblibro => res.json({ data: liblibro }))
});
  
// @route GET books
// @desc  Get All Available Books
// @access Public
router.get("/available", (req, res) =>{

    BookModel.find({reservedBy: ''},function(err, books) {
      if (err) throw err;
      console.log("Available books " + books.length);
      res.json({ data: books}); 
    });

});

// @route POST books
// @desc  Add A Book
// @access Public
router.post("/", (req, res) => {

    BookModel.create(req.body, (err, obj) => {
      if (err) throw err;
      console.log("1 document added"); 
      
      //return all books after adding one to update the UI
      BookModel.find({}, (err, books) => {
        if (err) throw err;
        console.log("number of books " + books.length);
        res.json({ data: books}); 
      });
    });
     
});
  
// @route DELETE books
// @desc  Delete A Book
// @access Public
router.delete('/:id', (req, res) => {

    BookModel.deleteOne({ _id: req.params.id }, (err, obj) => {
      if (err) throw err;
      console.log("1 document deleted");

      //return all books after deleting one to update the UI
      BookModel.find({}, (err, books) => {
        if (err) throw err;
        console.log("Remaining books " + books.length);
        res.json({ data: books}); 
      });   
    });  
      
});
  
  // @route PUT books
  // @desc  Update A Book
  // @access Public
router.put('/:ISBN', (req, res) => {
    const ISBN = req.params.ISBN;
  
    BookModel.updateOne({ ISBN: ISBN}, req.body, (err, obj) => {
      if (err) throw err;        

      //return all books after updating one to update the UI
      BookModel.find({},function(err, books) {
        if (err) throw err;
        //console.log("number of books " + books.length);
        res.json({ data: books}); 
      });
    });
    
});
  
// @route GET student reservations
// @desc  Get All Reserved Books
// @access Public
router.get("/studentreservations", (req, res) =>{
    //res.json({ data: reservations });
    BookModel.aggregate([
      { $match: { reservedBy: { $ne: "" } } },
      {
          $lookup: {
            from: "students",
            localField: "reservedBy",    // field in the orders collection
            foreignField: "IDNum",  // field in the items collection
            as: "reservedBooks"
          }
      },
      {
          $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$reservedBooks", 0 ] }, "$$ROOT" ] } }
      },
      { $project: { fromItems: 0 } }]
      , (err, books) => {
        if (err) throw err;
        console.log("Total Reserved Books: " + books.length);
        res.json({ data: books}); 
      });       
  });
  
  // @route GET books
  // @desc  Get All Reserved Books By A Student
  // @access Public
  router.get("/reservations/:IDNum", (req, res) => {  
    const IDNum = req.params.IDNum;
    console.log(IDNum)
    BookModel.aggregate([
      { $match: { reservedBy: { $eq: IDNum } } },
      {
          $lookup: {
            from: "students",
            localField: "reservedBy",    // field in the orders collection
            foreignField: "IDNum",  // field in the items collection
            as: "reservedBooks"
          }
      },
      {
          $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$reservedBooks", 0 ] }, "$$ROOT" ] } }
      },
      { $project: { fromItems: 0 } }]
      , (err, books) => {
        if (err) throw err;
        console.log(err);
        console.log(`Total Reserved Books of ${IDNum} : ` + books.length);
        res.json({ data: books}); 
      });    
  });
  
  // @route POST books
  // @desc  Specify a reservation for book(s)
  // @access Public
  router.post("/reservations", (req, res) => {
    const booksToReserve = [...req.body];
    const IDNum = booksToReserve[0].IDNum;
    // let ISBNs = booksToReserve.map(book => book.ISBN);
    let BookIDs = booksToReserve.map(book => book._id);

    // await BookModel.updateMany({ 'ISBN': { $in: ISBNs } }, { $set: { reservedBy: IDNum } }, (err, obj) => {
    BookModel.updateMany({ '_id': { $in: BookIDs } }, { $set: { reservedBy: IDNum } }, (err, obj) => {
      if (err) throw err;
      console.log(obj);   
      
      BookModel.aggregate([
        { $match: { reservedBy: { $eq: IDNum } } },
        {
            $lookup: {
              from: "students",
              localField: "reservedBy",    // field in the orders collection
              foreignField: "IDNum",  // field in the items collection
              as: "reservedBooks"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$reservedBooks", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { fromItems: 0 } }]
        , (err, books) => {
          if (err) throw err;
          console.log(`Total Reserved Books of ${IDNum} : ` + books.length);
          res.json({ data: books}); 
        });     
    });
  
  });
  
  // @route DELETE books
  // @desc  Cancel a reservation for a book
  // @access Public
  router.delete('/cancelreservations/:ISBN&:IDNum', (req, res) => {
    const ISBN = req.params.ISBN;
    const IDNum = req.params.IDNum;
  
    BookModel.updateOne({ ISBN: ISBN}, { reservedBy: ''}, (err, obj) => {
      if (err) throw err;
      console.log("1 document updated");

      BookModel.aggregate([
        { $match: { reservedBy: { $eq: IDNum } } },
        {
            $lookup: {
              from: "students",
              localField: "reservedBy",    // field in the orders collection
              foreignField: "IDNum",  // field in the items collection
              as: "reservedBooks"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$reservedBooks", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { fromItems: 0 } }]
        , (err, books) => {
          if (err) throw err;
          console.log(`Total Reserved Books of ${IDNum} : ` + books.length);
          res.json({ data: books}); 
      });   
    });
  
  });

  
router.get("/search", (req, res) =>{
    const criteria = req.query.criteria;  
    let searchResult = books.filter(item => item.toLowerCase().indexOf(criteria) > -1);   
    res.json(searchResult);
  });

  //catch all
router.all("*", (req, res) => {
  res.status(404).send('Mali ka ng route');
})

module.exports = router;