'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
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
        const book = new bookModel({
          title
        });

        await book.save();

        return res.status(200).json({
          _id: book._id,
          title: book.title,
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
      const _id = req.params.id;

      try {
        const book = await bookModel.findById(new ObjectId(_id));
      
        if (!book) {
          return res.status(200).send('no book exists');
        }

        res.status(200).json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length,
        });
      } catch(error) {
        return res.status(200).send('no book exists');
      }
    })
    
    .post(async (req, res) => {
      const _id = req.params.id;
      const comment = req.body.comment;
      
      if (!comment) {
        return res.status(200).send('missing required field comment');
      }

      try {
        const book = await bookModel.findOneAndUpdate(
          { _id },
          { $push: { 
            comments: comment 
          }}, 
          { new: true }
        );
        
        if (!book) {
          return res.status(200).send('no book exists');
        }

        res.status(200).json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length,
        });
      } catch(error) {
        return res.status(200).send('no book exists');
      }
    })
    
    .delete(async (req, res) => {
      let _id = req.params.id;

      try {
        const book = await bookModel.findByIdAndDelete(new ObjectId(_id));
        
        if (!book) {
          return res.status(200).send('no book exists');
        }

        return res.status(200).send('delete successful');
      } catch(error) {
        return res.status(200).send('no book exists');
      }
    });
  
};
