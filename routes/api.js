'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { DB } = process.env;

(async () => {
  try {
    await mongoose.connect(
      DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  } catch(error) {
    res.status(200).json({
      error,
      message: 'DB Error',
    });
  }
})();

const dbConnection = mongoose.connection;
dbConnection.on('error', () => console.error.bind(console, 'MongoDB Connection Error:'));
dbConnection.on('open', () => console.log('MongoDB Connection Established Successfully'));

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ 
    type: String, 
  }],
}, {
  timestamps: true,
});

const bookModel = mongoose.model('book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await bookModel.find();

        res.status(200).json(
          books.map((book) => ({
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length,
          }))
        );
      } catch(error) {
        res.status(200).json({
          error,
          message: 'Server Error',
        });
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      
      if (!title) {
        return res.status(200).send('missing required field title');
      }

      try {
        const bookNew = new bookModel({
          title
        });

        await bookNew.save();

        return res.status(200).json({
          _id: bookNew._id,
          title: bookNew.title,
        });
      } catch(error) {
        res.status(200).json({
          error,
          message: 'Server Error',
        });
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
